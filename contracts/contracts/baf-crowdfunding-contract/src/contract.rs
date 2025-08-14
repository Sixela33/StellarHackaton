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
        campaign::get_id, 
        structs::campaign::Campaign,
        types::error::Error
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
}