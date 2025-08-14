use soroban_sdk::{Address, Env};
use crate::{
    events,
    methods::token::token_transfer,
    storage::{
        campaign::{
            campain_exists, 
            get_campaign, 
            set_campaign
        }, 
        contribution::{
            get_contribution, 
            set_contribution}, 
        types::{
            error::Error, 
            storage::CampaignStatus
        }
    }
};

pub fn contribute(env: &Env, contributor: Address, campaign_id: u32, amount: i128) -> Result<(), Error> {
    contributor.require_auth();

    if amount <= 0 {
        return Err(Error::AmountMustBePositive);
    }

    if !campain_exists(env, &campaign_id) {
        return Err(Error::CampaignNotFound);
    }

    let mut campaign = get_campaign(env, &campaign_id)?;

    if campaign.status != CampaignStatus::RUNNING {
        return Err(Error::CampaignNotRunning);
    }

    if amount < campaign.min_donation {
        return Err(Error::ContributionBelowMinimum);
    }

    let remaining = campaign.goal - campaign.total_raised;
    if remaining <= 0 {
        return Err(Error::CampaignGoalExceeded);
    }
    let contribution_amount = amount.min(remaining);

    token_transfer(
        &env, 
        &contributor, 
        &env.current_contract_address(), 
        &contribution_amount
    )?;

    let prev = get_contribution(env, &campaign_id, &contributor);

    let new_total = prev.checked_add(contribution_amount).ok_or(Error::MathOverflow)?;
    
    set_contribution(env, &campaign_id, &contributor, new_total);
    
    if prev == 0 { 
        campaign.supporters = campaign.supporters.checked_add(1).ok_or(Error::MathOverflow)?; 
    }

    campaign.total_raised = campaign.total_raised.checked_add(contribution_amount).ok_or(Error::MathOverflow)?;
    if campaign.total_raised == campaign.goal { campaign.status = CampaignStatus::COMPLETE; }
    set_campaign(env, &campaign_id, &campaign);

    events::contribute::add_contribute(&env, &contributor, &campaign_id, &contribution_amount);

    Ok(())
}