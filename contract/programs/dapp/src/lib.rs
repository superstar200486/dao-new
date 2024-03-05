use anchor_lang::prelude::*;
pub mod instructions;
pub mod error;
pub mod state;
pub mod constants;

use instructions::*;
pub use error::*;
pub use constants::*;

declare_id!("GENB5E93yFBPeR9ZCT5NpmV4n9BmmU1BurNoJ2ootYWd");

#[program]
pub mod dapp {
    use super::*;
    
    pub fn initialize(
        ctx: Context<Initialize>,
        issue_price: u64,
        issue_amount: u64,
        proposal_fee: u64,
        max_supply: u64,
        min_quorum: u64,
        max_expiry_days: u64,
    ) -> Result<()> {
        instructions::init(
            ctx,
            issue_price,
            issue_amount,
            proposal_fee,
            max_supply,
            min_quorum,
            max_expiry_days,
        )
    }

    pub fn create_user_account(
        ctx: Context<CreateUserAccount>,
        name: String,
    ) -> Result<()> {
        instructions::create_user(ctx, name)
    }
    
    pub fn activate_user(
        ctx: Context<ActivateUser>,
        _userkey: Pubkey,
    ) -> Result<()> {
        instructions::activate_user(ctx)
    }

    pub fn mint_tokens(ctx: Context<MintTokens>) -> Result<()> {
        instructions::mint_tokens(ctx)
    }

    pub fn disable_user(
        ctx: Context<DisableUser>,
        _userkey: Pubkey,
    ) -> Result<()> {
        instructions::disable_user(ctx)
    }

    pub fn transfer_tokens(
        ctx: Context<TransferSPLTokens>,
        _receiver: Pubkey,
        amount: u64,
    ) -> Result<()> {
        instructions::transfer_tokens(ctx, amount)
    }

    pub fn create_proposal(
        ctx: Context<CreateProposal>,
        title: String,
        desc: String,
        expiry_days: u64,
        min_quorum: u64,
    ) -> Result<()> {
        instructions::create_proposal(
            ctx,
            title,
            desc,
            expiry_days,
            min_quorum,
        )
    }

    pub fn approve_proposal(
        ctx: Context<ApproveProposal>,
        _id: u64,
        _creator: Pubkey,
    ) -> Result<()> {
        instructions::approve_proposal(ctx)
    }

    pub fn vote(
        ctx: Context<Vote>,
        _id: u64, 
        _creator: Pubkey
    ) -> Result<()> {
        instructions::vote(ctx)
    }

    pub fn complete_proposal(
        ctx: Context<CompleteProposal>,
        _id: u64,
        _creator: Pubkey,
    ) -> Result<()> {
        instructions::complete_proposal(ctx)
    }

    pub fn close_proposal(
        ctx: Context<CloseProposal>,
        _id: u64,
        _creator: Pubkey,
    ) -> Result<()> {
        instructions::close_proposal(ctx)
    }
}