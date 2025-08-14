use soroban_sdk::{Address, Env};

use crate::{
    methods::get_campaign::{
        get_campaign
    }, 
    storage::{
        campaign::set_campaign, 
        roles::has_role, 
        types::{
            error::Error, 
            roles::Role
        }
    }
};

pub fn approve_liberation(env: Env, sender: Address, campaign_id: u32, milestone_id: u32) -> Result<(), Error> {
    sender.require_auth();
    if !has_role(&env, Role::Judge, sender) {
        return Err(Error::Unauthorised);
    }

    let mut campaign = get_campaign(&env, &campaign_id)?;

    let mut milestone = campaign.milestones.get(milestone_id).ok_or(Error::MilestoneNotFound)?.clone();
    
    milestone.approved = true;

    campaign.milestones.set(milestone_id, milestone.clone());

    set_campaign(&env, &campaign_id, &campaign);
    Ok(())
}