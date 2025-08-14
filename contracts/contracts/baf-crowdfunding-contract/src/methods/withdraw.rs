use soroban_sdk::{Env};

use crate::{
    events,
    methods::token::token_transfer,
    storage::{
        campaign::{
            get_campaign, 
            set_campaign
        }, 
        types::{
            error::Error, 
            storage::{
                CampaignStatus, 
                MilestoneStatus
            }}
    }
};

pub fn withdraw(env: &Env, campaign_id: u32, milestone_id: u32) -> Result<(), Error> {

    let mut campaign = get_campaign(env, &campaign_id)?;

    let mut milestone = campaign.milestones.get(milestone_id).ok_or(Error::MilestoneNotFound)?.clone();
    milestone.reciever.require_auth();
    if milestone.amount <= 0 { return Err(Error::AmountMustBePositive); }

    if campaign.total_raised != campaign.goal {
        return Err(Error::CampaignGoalNotReached);
    }

    if !(milestone.status == MilestoneStatus::AVAILABLE) {
        return Err(Error::MilestoneNotAvailableToWithdraw)
    }

    let new_distributed = campaign.distributed.checked_add(milestone.amount).ok_or(Error::MathOverflow)?;
    if new_distributed > campaign.goal { 
        return Err(Error::CampaignGoalExceeded); 
    }

    campaign.distributed = new_distributed;
    if new_distributed == campaign.goal { 
        campaign.status = CampaignStatus::COMPLETE; 
    }

    milestone.status = MilestoneStatus::FREED;
    campaign.milestones.set(milestone_id, milestone.clone());
    set_campaign(env, &campaign_id, &campaign);

    token_transfer(
        &env,
        &env.current_contract_address(),
        &milestone.reciever, 
        &milestone.amount
    )?;

    events::campaign::withdraw(&env, &campaign_id, milestone.amount);
    
    Ok(())   
}