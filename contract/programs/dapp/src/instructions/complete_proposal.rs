use anchor_lang::prelude::*;
use crate::state::{Proposal, User};

#[derive(Accounts)]
#[instruction(_id: u64, _creator: Pubkey)]
pub struct CompleteProposal<'info> {
    #[account(mut)]
    signer: Signer<'info>,
    #[account(
        seeds=[b"user", signer.key().as_ref()],
        bump = user_account.user_bump,
    )]
    user_account: Account<'info, User>,
    #[account(
        mut,
        seeds=[b"proposal", _creator.key().as_ref(), _id.to_le_bytes().as_ref()],
        bump = proposal.proposal_bump,
        constraint = signer.key() == proposal.creator,
    )]
    proposal: Account<'info, Proposal>,
    system_program: Program<'info, System>,
}

pub fn complete_proposal(
    ctx: Context<CompleteProposal>,
) -> Result<()> {
    ctx.accounts.user_account.check_active()?;
    ctx.accounts.proposal.complete_proposal()
}