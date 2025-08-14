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
fn test_judge_can_approve_and_enables_withdraw() {
	let env = Env::default();
	let (client, _admin, token) = deploy_contract(&env);

	// Create campaign goal=100 with one milestone
	let recv = Address::generate(&env);
	let milestones = vec![&env, make_milestone(&env, "m1", 100, &recv, false)];
	let campaign = make_campaign(&env, 100, 10, milestones);
	client.create_campaign(&campaign);

	// Fund to goal
	let contributor = Address::generate(&env);
	token.1.mint(&contributor, &100);
	client.contribute(&contributor, &0, &100);

	// Add judge and approve milestone
	let judge = Address::generate(&env);
	client.add_judge(&judge);
	client.approve_liberation(&judge, &0, &0);

	// Now withdraw should succeed
	client.withdraw(&0, &0);
	let c = client.get_campaign(&0);
	assert_eq!(c.distributed, 100);
	assert_eq!(token.0.balance(&recv), 100);
}

#[test]
fn test_non_judge_cannot_approve() {
	let env = Env::default();
	let (client, _admin, _token) = deploy_contract(&env);

	let recv = Address::generate(&env);
	let milestones = vec![&env, make_milestone(&env, "m1", 10, &recv, false)];
	let campaign = make_campaign(&env, 10, 1, milestones);
	client.create_campaign(&campaign);

	let not_judge = Address::generate(&env);
	let res = client.try_approve_liberation(&not_judge, &0, &0);
	assert!(res.is_err());
}

#[test]
fn test_removed_judge_cannot_approve() {
	let env = Env::default();
	let (client, _admin, _token) = deploy_contract(&env);

	let recv = Address::generate(&env);
	let milestones = vec![&env, make_milestone(&env, "m1", 10, &recv, false)];
	let campaign = make_campaign(&env, 10, 1, milestones);
	client.create_campaign(&campaign);

	let judge = Address::generate(&env);
	client.add_judge(&judge);
	client.remove_judge(&judge);

	let res = client.try_approve_liberation(&judge, &0, &0);
	assert!(res.is_err());
}
