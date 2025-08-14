use soroban_sdk::{Address, Env};

use super::types::storage::DataKey;

pub(crate) fn has_contribution(env: &Env, campaign_id: &u32, contributor: &Address) -> bool {
    let key = DataKey::Contribution(campaign_id.clone(), contributor.clone());

    env.storage().instance().has(&key)
}

pub(crate) fn set_contribution(env: &Env, campaign_id: &u32, contributor: &Address, amount: i128) {
    let key = DataKey::Contribution(campaign_id.clone(), contributor.clone());

    env.storage().instance().set(&key, &amount);
}

pub(crate) fn get_contribution(env: &Env, campaign_id: &u32, contributor: &Address) -> i128 {
    let key = DataKey::Contribution(campaign_id.clone(), contributor.clone());

    env.storage().instance().get(&key).unwrap_or(0i128)
}

pub(crate) fn remove_contribution(env: &Env, campaign_id: &u32, contributor: &Address) {
    let key = DataKey::Contribution(campaign_id.clone(), contributor.clone());

    env.storage().instance().remove(&key);
}