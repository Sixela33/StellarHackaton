use soroban_sdk::{Address, Env};
use crate::{
    events,
    methods::token::token_transfer,
    storage::{
        campaign::{
            get_campaign, 
            campain_exists, 
            set_campaign
        }, 
        contribution::set_contribution, 
        types::error::Error
    }
};

pub fn contribute(env: &Env, contributor: Address, campaign_id: u32, amount: i128) -> Result<(), Error> {
    contributor.require_auth();

    if amount < 0 {
        return Err(Error::AmountMustBePositive);
    }

    if !campain_exists(env, &campaign_id) {
        return Err(Error::CampaignNotFound);
    }

    let mut campaign = get_campaign(env, &campaign_id)?;

    if campaign.min_donation > amount {
        return Err(Error::ContributionBelowMinimum);
    }

    if campaign.total_raised + amount > campaign.goal {
        return Err(Error::CampaignGoalExceeded);
    }

    token_transfer(&env, &contributor, &env.current_contract_address(), &amount)?;

    campaign.total_raised += amount;
    campaign.supporters += 1;
    campaign.supporters_list.push_back(contributor.clone());
    
    set_campaign(env, &campaign_id, &campaign);
    set_contribution(env, &campaign_id, &contributor, amount);
    events::contribute::add_contribute(&env, &contributor, &campaign_id, &amount);

    Ok(())
}