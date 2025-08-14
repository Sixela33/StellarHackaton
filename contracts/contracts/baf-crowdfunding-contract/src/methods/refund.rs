use soroban_sdk::{Address, Env};

use crate::{
    events,
    methods::token::token_transfer, 
    storage::{
        campaign::{
            get_campaign, 
            set_campaign
        }, 
        contribution::{
            get_contribution, 
            has_contribution, 
            remove_contribution
        }, 
        types::{
            error::Error, 
            storage::CampaignStatus
        }
    }
};

pub fn refund(env: &Env, contributor: Address, campaign_id: u32) -> Result<(), Error> {
    contributor.require_auth();

    let mut campaign = get_campaign(env, &campaign_id)?;

    // Not allowing refund once funding is complete
    if campaign.status == CampaignStatus::COMPLETE {
        return Err(Error::CampaignNotRefundable)
    }

    if !has_contribution(env, &campaign_id, &contributor) {
        return Err(Error::ContributionNotFound);
    }

    let amount = get_contribution(env, &campaign_id, &contributor);
    if amount <= 0 { 
        return Err(Error::ContributionNotFound); 
    }
    token_transfer(&env, &env.current_contract_address(), &contributor, &amount)?;

    campaign.total_raised = campaign.total_raised.checked_sub(amount).ok_or(Error::MathUnderflow)?;
    remove_contribution(env, &campaign_id, &contributor);
    campaign.supporters = campaign.supporters.saturating_sub(1);

    set_campaign(env, &campaign_id, &campaign);
    events::refund::refund(&env, &contributor, &campaign_id, &amount);

    Ok(())
}