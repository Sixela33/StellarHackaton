use soroban_sdk::{Env, Symbol};

pub(crate) fn add_campaign(env: &Env, campaign_id: &u32, goal: &i128) {
    let topics = (Symbol::new(env, "add_campaign"), campaign_id);
    env.events().publish(topics, goal);
}

pub (crate) fn withdraw(env: &Env, campaign_id: &u32, total_raised: i128) {
    let topics = (Symbol::new(env, "withdraw"), campaign_id);
    env.events().publish(topics, &total_raised);
}