use anchor_lang::prelude::*;
use crate::state::{Proposal, Config};

#[derive(Accounts)]
#[instruction(_id: u64, _creator: Pubkey)]
pub struct ApproveProposal<'info> {
    #[account(mut)]
    signer: Signer<'info>,
    #[account(
        mut,
        seeds=[b"proposal", _creator.key().as_ref(), _id.to_le_bytes().as_ref()],
        bump = proposal.proposal_bump,
        constraint = signer.key() == config.admin,
    )]
    proposal: Account<'info, Proposal>,
    #[account(
        seeds=[b"config"],
        bump = config.config_bump
    )]
    config: Box<Account<'info, Config>>,
    system_program: Program<'info, System>,
}

pub fn approve_proposal(
    ctx: Context<ApproveProposal>,
) -> Result<()> {
    ctx.accounts.proposal.approve_proposal()
}