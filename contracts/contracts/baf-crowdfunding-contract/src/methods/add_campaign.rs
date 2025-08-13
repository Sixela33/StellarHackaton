use soroban_sdk::{Env};

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

pub fn add_campaign(env: &Env, campaign: Campaign) -> Result<(), Error> {
    let current_admin = get_admin(env);

    current_admin.require_auth();
    
    let campaign_id = get_next_id(env)?;

    set_campaign(&env, &campaign_id, &campaign);
    events::campaign::add_campaign(&env, &campaign_id, &campaign);
    Ok(())
}