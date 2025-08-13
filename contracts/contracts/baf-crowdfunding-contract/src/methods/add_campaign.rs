use soroban_sdk::{Address, Env, Vec};

use crate::{
    events,
    storage::{
        admin::get_admin, 
        campaign::{
            set_campaign,
            get_next_id
        }, 
        structs::campaign::Campaign, 
        types::{
            error::Error
        }
    },
};

pub fn add_campaign(env: &Env, creator: Address, goal: i128, min_donation: i128) -> Result<(), Error> {
    let current_admin = get_admin(env);

    current_admin.require_auth();
    
    let campaign = Campaign {
        goal,
        min_donation,
        total_raised: 0,
        supporters: 0,
        supporters_list: Vec::new(env)
    };
    
    let campaign_id = get_next_id(env)?;

    set_campaign(&env, &campaign_id, &campaign);
    events::campaign::add_campaign(&env, &campaign_id, &goal);
    Ok(())
}