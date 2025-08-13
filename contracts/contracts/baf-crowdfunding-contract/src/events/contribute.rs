use soroban_sdk::{Address, Env, Symbol};


pub(crate) fn add_contribute(env: &Env, contributor: &Address, campaign_id: &u32, amount: &i128) {
    let topics = (Symbol::new(env, "add_contribute"), contributor);
    let data = (campaign_id, amount);
    env.events().publish(topics, data);
}
