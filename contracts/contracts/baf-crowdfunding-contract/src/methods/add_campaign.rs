use soroban_sdk::{Env};

use crate::{
    events,
    storage::{
        admin::get_admin, 
        campaign::{
            get_next_id, 
            set_campaign
        }, 
        structs::campaign::Campaign, 
        types::{
            error::Error, 
            storage::CampaignStatus
        }
    },
};

pub fn add_campaign(env: &Env, mut campaign: Campaign) -> Result<(), Error> {
    let current_admin = get_admin(env);

    current_admin.require_auth();
    
    let campaign_id = get_next_id(env)?;

    // Validate that the sum of milestones equals the campaign goal, using checked addition
    // try_fold is like reduce in typescrypt
    let milestones_total = campaign.milestones.iter().try_fold(0i128, |acc, milestone| {
        if milestone.amount <= 0 { return Err(Error::AmountMustBePositive); }
        acc.checked_add(milestone.amount).ok_or(Error::MathOverflow)
    })?;

    if milestones_total != campaign.goal {
        return Err(Error::MilestonesTotalMismatch);
    }

    campaign.distributed = 0;
    campaign.total_raised = 0;
    campaign.supporters = 0;
    campaign.status = CampaignStatus::RUNNING;
    set_campaign(env, &campaign_id, &campaign);
    events::campaign::add_campaign(&env, &campaign_id, &campaign);
    Ok(())
}