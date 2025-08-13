use soroban_sdk::{Env};

use crate::storage::{
    campaign::get_campaign as read_campaign, structs::campaign::Campaign, types::error::Error
};

pub fn get_campaign(env: &Env, campaign_address: &u32) ->  Result<Campaign, Error> {
    let campaign = read_campaign(env, &campaign_address)?;
    Ok(campaign)
}