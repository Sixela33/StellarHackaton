use soroban_sdk::{Address, Env};

use crate::storage::{structs::campaign::Campaign, types::error::Error};

use super::types::storage::DataKey;

pub(crate) fn has_campaign(env: &Env, creator: &Address) -> bool {
    let key = DataKey::Campaign(creator.clone());

    env.storage().instance().has(&key)
}

pub(crate) fn set_campaign(env: &Env, creator: &Address, campaign: &Campaign) {
    let key = DataKey::Campaign(creator.clone());

    env.storage().instance().set(&key, campaign);
}

pub(crate) fn get_campaign(env: &Env, creator: &Address) ->  Result<Campaign, Error> {
    let key = DataKey::Campaign(creator.clone());

    env.storage().instance().get(&key).ok_or(Error::CampaignNotFound)
}

pub(crate) fn remove_campaign(env: &Env, creator: &Address) {
    let key = DataKey::Campaign(creator.clone());

    env.storage().instance().remove(&key);
}

pub(crate) fn add_supporter(env: &Env, campaign_address: &Address, supporter: &Address) -> Result<(), Error> {
    let mut campaign = get_campaign(env, campaign_address)?;

    campaign.supporters_list.push_back(supporter.clone());

    Ok(())
}