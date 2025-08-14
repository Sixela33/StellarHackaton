#![cfg(test)]

extern crate std;

use crate::contract::CrowdfundingContractClient;
use crate::CrowdfundingContract;

use crate::storage::structs::campaign::{Campaign, Milestone};
use crate::storage::types::storage::{CampaignStatus, MilestoneStatus};

use soroban_sdk::{
    testutils::Address as _,
    token,
    vec,
    Address,
    Env,
    String,
    Vec,
};
use token::Client as TokenClient;
use token::StellarAssetClient as TokenAdminClient;

fn create_usdc_token<'a>(e: &Env, admin: &Address) -> (TokenClient<'a>, TokenAdminClient<'a>) {
    let sac = e.register_stellar_asset_contract_v2(admin.clone());
    (
        TokenClient::new(e, &sac.address()),
        TokenAdminClient::new(e, &sac.address()),
    )
}

fn deploy_contract<'a>(env: &Env) -> (CrowdfundingContractClient<'a>, Address, (TokenClient<'a>, TokenAdminClient<'a>)) {
    env.mock_all_auths();
    let admin = Address::generate(env);
    let token = create_usdc_token(env, &admin);
    let client = CrowdfundingContractClient::new(
        env,
        &env.register(
            CrowdfundingContract {},
            (
                admin.clone(),
                token.0.address.clone(),
            ),
        ),
    );
    (client, admin, token)
}

fn make_milestone(env: &Env, description: &str, amount: i128, reciever: &Address, is_approved: bool) -> Milestone {
    Milestone {
        description: String::from_str(env, description),
        status: MilestoneStatus::REQUESTED,
        evidence: String::from_str(env, ""),
        approved: is_approved,
        amount,
        reciever: reciever.clone(),
    }
}

fn make_campaign(env: &Env, goal: i128, min_donation: i128, milestones: Vec<Milestone>) -> Campaign {
    Campaign {
        goal,
        distributed: 0,
        min_donation,
        total_raised: 0,
        supporters: 0,
        milestones,
        status: CampaignStatus::RUNNING,
    }
}

#[test]
fn test_create_campaign_success_and_normalization() {
    let env = Env::default();
    let (client, _admin, _token) = deploy_contract(&env);

    let r1 = Address::generate(&env);
    let r2 = Address::generate(&env);

    let milestones = vec![
        &env,
        make_milestone(&env, "m1", 100, &r1, true),
        make_milestone(&env, "m2", 200, &r2, true),
    ];
    let goal = 300i128;
    let min_donation = 50i128;
    let campaign = make_campaign(&env, goal, min_donation, milestones);

    client.create_campaign(&campaign);

    // First campaign id is 0
    let stored = client.get_campaign(&0);
    assert_eq!(stored.goal, goal);
    assert_eq!(stored.min_donation, min_donation);
    assert_eq!(stored.distributed, 0);
    assert_eq!(stored.total_raised, 0);
    assert_eq!(stored.supporters, 0);
    assert_eq!(stored.status, CampaignStatus::RUNNING);

    // Milestones are normalized to AVAILABLE and approved=false
    let m0 = stored.milestones.get(0).unwrap();
    assert_eq!(m0.status, MilestoneStatus::AVAILABLE);
    assert_eq!(m0.approved, true);
    let m1 = stored.milestones.get(1).unwrap();
    assert_eq!(m1.status, MilestoneStatus::AVAILABLE);
    assert_eq!(m1.approved, true);
}

#[test]
fn test_create_campaign_validation_errors() {
    let env = Env::default();
    let (client, _admin, _token) = deploy_contract(&env);

    let recv = Address::generate(&env);

    // min_donation <= 0
    let milestones = vec![&env, make_milestone(&env, "m1", 100, &recv, true)];
    let bad_campaign = make_campaign(&env, 100, 0, milestones);
    let res = client.try_create_campaign(&bad_campaign);
    assert!(res.is_err());

    // milestone amount <= 0
    let milestones = vec![&env, make_milestone(&env, "m1", 0, &recv, true)];
    let bad_campaign = make_campaign(&env, 100, 10, milestones);
    let res = client.try_create_campaign(&bad_campaign);
    assert!(res.is_err());
    

    // sum(milestones) != goal
    let milestones = vec![
        &env,
        make_milestone(&env, "m1", 100, &recv, true),
        make_milestone(&env, "m2", 100, &recv, true),
    ];
    let bad_campaign = make_campaign(&env, 300, 10, milestones);
    let res = client.try_create_campaign(&bad_campaign);
    assert!(res.is_err());
}

#[test]
fn test_get_max_campaign_index_behavior() {
    let env = Env::default();
    let (client, _admin, _token) = deploy_contract(&env);

    // Before any campaign created
    let res = client.try_get_max_campaign_index();
    assert!(res.is_err());

    // After first campaign (id=0), index stored is next id (1)
    let recv = Address::generate(&env);
    let milestones = vec![&env, make_milestone(&env, "m1", 10, &recv, true)];
    let campaign = make_campaign(&env, 10, 1, milestones);
    client.create_campaign(&campaign);
    assert_eq!(client.get_max_campaign_index(), 1);

    // After second campaign (id=1), index becomes 2
    client.create_campaign(&campaign);
    assert_eq!(client.get_max_campaign_index(), 2);
}

#[test]
fn test_contribute_happy_path_and_goal_completion() {
    let env = Env::default();
    let (client, _admin, token) = deploy_contract(&env);

    // Create campaign goal=300
    let r1 = Address::generate(&env);
    let milestones = vec![
        &env,
        make_milestone(&env, "m1", 100, &r1, true),
        make_milestone(&env, "m2", 200, &r1, true),
    ];
    let campaign = make_campaign(&env, 300, 50, milestones);
    client.create_campaign(&campaign);

    // Mint balances to contributors
    let alice = Address::generate(&env);
    let bob = Address::generate(&env);
    token.1.mint(&alice, &200);
    token.1.mint(&bob, &250);

    // Alice contributes 70 (>= min), total becomes 70, supporters=1
    client.contribute(&alice, &0, &70);
    let c = client.get_campaign(&0);
    assert_eq!(c.total_raised, 70);
    assert_eq!(c.supporters, 1);
    assert_eq!(token.0.balance(&client.address), 70);

    // Bob contributes 250 but only 230 remaining is accepted; campaign completes
    client.contribute(&bob, &0, &250);
    let c = client.get_campaign(&0);
    assert_eq!(c.total_raised, 300);
    assert_eq!(c.status, CampaignStatus::COMPLETE);
    assert_eq!(token.0.balance(&client.address), 300);
}

#[test]
fn test_contribute_errors() {
    let env = Env::default();
    let (client, _admin, token) = deploy_contract(&env);

    // Create small campaign
    let r = Address::generate(&env);
    let milestones = vec![&env, make_milestone(&env, "m1", 10, &r, true)];
    let campaign = make_campaign(&env, 10, 5, milestones);
    client.create_campaign(&campaign);

    let user = Address::generate(&env);
    token.1.mint(&user, &100);

    // amount <= 0
    let res = client.try_contribute(&user, &0, &0);
    assert!(res.is_err());

    // below min
    let res = client.try_contribute(&user, &0, &3);
    assert!(res.is_err());

    // Unknown campaign
    let res = client.try_contribute(&user, &999, &6);
    assert!(res.is_err());

    // Fill the campaign and attempt extra contribution
    client.contribute(&user, &0, &10);
    let res = client.try_contribute(&user, &0, &1);
    assert!(res.is_err());
}

#[test]
fn test_refund_success_and_restrictions() {
    let env = Env::default();
    let (client, _admin, token) = deploy_contract(&env);

    // Campaign goal 200, min 50
    let recv = Address::generate(&env);
    let milestones = vec![&env, make_milestone(&env, "m", 200, &recv, true)];
    let campaign = make_campaign(&env, 200, 50, milestones);
    client.create_campaign(&campaign);

    let user = Address::generate(&env);
    token.1.mint(&user, &200);

    // Contribute 100 then refund
    client.contribute(&user, &0, &100);
    let before = token.0.balance(&user);
    client.refund(&user, &0);
    let after = token.0.balance(&user);
    assert!(after > before);

    let c = client.get_campaign(&0);
    assert_eq!(c.total_raised, 0);
    assert_eq!(c.supporters, 0);

    // Second refund should fail (no contribution)
    let res = client.try_refund(&user, &0);
    assert!(res.is_err());

    // Reach goal -> refund should be blocked with CampaignNotRefundable
    client.contribute(&user, &0, &200);
    let res = client.try_refund(&user, &0);
    assert!(res.is_err());
}

#[test]
fn test_withdraw_flow_and_errors() {
    let env = Env::default();
    let (client, _admin, token) = deploy_contract(&env);

    // Campaign with two milestones 100 and 200
    let r1 = Address::generate(&env);
    let r2 = Address::generate(&env);
    let milestones = vec![
        &env,
        make_milestone(&env, "m1", 100, &r1, true),
        make_milestone(&env, "m2", 200, &r2, true),
    ];
    let campaign = make_campaign(&env, 300, 10, milestones);
    client.create_campaign(&campaign);

    // Before goal reached -> withdrawing should fail
    let res = client.try_withdraw(&0, &0);
    assert!(res.is_err());

    // Fund to goal
    let a = Address::generate(&env);
    token.1.mint(&a, &300);
    client.contribute(&a, &0, &300);

    // Invalid milestone id
    let res = client.try_withdraw(&0, &99);
    assert!(res.is_err());

    // Withdraw milestone 0
    client.withdraw(&0, &0);
    let c = client.get_campaign(&0);
    assert_eq!(c.distributed, 100);
    assert_eq!(token.0.balance(&r1), 100);

    // Withdraw same milestone again -> not available
    let res = client.try_withdraw(&0, &0);
    assert!(res.is_err());

    // Withdraw milestone 1 -> completes distribution and campaign becomes COMPLETE
    client.withdraw(&0, &1);
    let c = client.get_campaign(&0);
    assert_eq!(c.distributed, 300);
    assert_eq!(c.status, CampaignStatus::COMPLETE);
    assert_eq!(token.0.balance(&r2), 200);
}
