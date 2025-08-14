use soroban_sdk::{contract, contractimpl, Env, Address};

use crate::{
    methods::{
        add_campaign::add_campaign, 
        contribute::contribute, 
        get_campaign::get_campaign, 
        initialize::initialize, 
        refund::refund, 
        withdraw::withdraw
    },
    storage::{
        admin::get_admin, 
        campaign::get_id, 
        roles::{
            remove_role, 
            set_role
        }, 
        structs::campaign::Campaign, 
        types::{
            error::Error, 
            roles::Role
        }
    },
};

#[contract]
pub struct CrowdfundingContract;

#[contractimpl]
impl CrowdfundingContract {
    pub fn __constructor(env: Env, admin: Address, token: Address) -> Result<(), Error> {
        initialize(&env, admin, token)
    }

    pub fn create_campaign(env: Env, campaign: Campaign) -> Result<(), Error> {
        add_campaign(&env, campaign)
    }

    pub fn get_campaign(env: Env, campaign_id: u32) -> Result<Campaign, Error> {
        get_campaign(&env, &campaign_id)
    }

    pub fn get_max_campaign_index(env: Env) -> Result<u32, Error> {
        get_id(&env)
    }

    pub fn contribute(env: Env, contributor: Address, campaign_id: u32, amount: i128) -> Result<(), Error> {
        contribute(&env, contributor, campaign_id, amount)
    }

    pub fn withdraw(env: Env, campaign_id: u32, milestone_id: u32) -> Result<(), Error> {
        withdraw(&env, campaign_id, milestone_id)
    }

    pub fn refund(env: Env, contributor: Address, campaign_id: u32) -> Result<(), Error> {
        refund(&env, contributor, campaign_id)
    }

    pub fn add_judge(env: Env, user: Address) -> Result<(), Error> {
        let admin = get_admin(&env);
        admin.require_auth();

        set_role(&env, Role::Judge, user);
        Ok(())
    }

    pub fn remove_judge(env: Env, user: Address) -> Result<(), Error> {
        let admin = get_admin(&env);
        admin.require_auth();

        remove_role(&env, Role::Judge, user);
        Ok(())
    }
}