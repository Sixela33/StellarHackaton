use soroban_sdk::{Env};

use crate::storage::{structs::campaign::Campaign, types::error::Error};

use super::types::storage::DataKey;

pub(crate) fn campain_exists(env: &Env, campaign_id: &u32) -> bool {
    let key: DataKey = DataKey::Campaign(campaign_id.clone());

    env.storage().instance().has(&key)
}

pub(crate) fn set_campaign(env: &Env, campaign_id: &u32, campaign: &Campaign) {
    let key = DataKey::Campaign(campaign_id.clone());

    env.storage().instance().set(&key, campaign);
}

pub(crate) fn get_campaign(env: &Env, campaign_id: &u32) ->  Result<Campaign, Error> {
    let key = DataKey::Campaign(campaign_id.clone());

    env.storage().instance().get(&key).ok_or(Error::CampaignNotFound)
}

pub(crate) fn remove_campaign(env: &Env, campaign_id: &u32) {
    let key = DataKey::Campaign(campaign_id.clone());

    env.storage().instance().remove(&key);
}

pub(crate) fn get_next_id(env: &Env) -> Result<u32, Error> {
    let key = DataKey::CampainID;

    let id = env.storage().instance().get(&key).unwrap_or(0);

    env.storage().instance().set(&key, &(&id + 1));

    Ok(id)
}

pub(crate) fn get_id(env: &Env) -> Result<u32, Error> {
    let key = DataKey::CampainID;

    match env.storage().instance().get(&key) {
        Some(id) => Ok(id),
        None => Err(Error::CampaignNotFound),
    }
}