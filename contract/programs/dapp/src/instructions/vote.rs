use anchor_lang::prelude::*;
use crate::state::{Proposal, UserVote, User};

#[derive(Accounts)]
#[instruction(_id: u64, _creator: Pubkey)]
pub struct Vote<'info> {
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
    )]
    proposal: Account<'info, Proposal>,
    #[account(
        init,
        payer = signer,
        seeds=[b"vote", signer.key().as_ref(), proposal.key().as_ref()],
        bump,
        space = UserVote::LEN,
    )]
    vote: Account<'info, UserVote>,
    system_program: Program<'info, System>,
}

pub fn vote(
    ctx: Context<Vote>,
) -> Result<()> {
    ctx.accounts.user_account.check_active()?;
    ctx.accounts.vote.vote(ctx.accounts.signer.key(), ctx.accounts.proposal.key())?;
    ctx.accounts.proposal.vote()
}