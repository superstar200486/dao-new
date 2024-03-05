use anchor_lang::{prelude::*, system_program::{transfer, Transfer},};
use crate::state::{Treasury, Proposal, Config, User};
use crate::error::ErrorCode;

#[derive(Accounts)]
pub struct CreateProposal<'info> {
    #[account(mut)]
    creator: Signer<'info>,
    #[account(
        seeds=[b"user", creator.key().as_ref()],
        bump = user_account.user_bump,
    )]
    user_account: Account<'info, User>,
    #[account(
        init,
        payer = creator,
        seeds=[b"proposal", creator.key().as_ref(),
            config.proposal_count.checked_add(1).ok_or(ErrorCode::Overflow)?.to_le_bytes().as_ref()],
        bump,
        space = Proposal::LEN,
    )]
    proposal: Account<'info, Proposal>,
    #[account(
        mut,
        seeds=[b"treasury", config.key().as_ref()],
        bump = config.treasury_bump,
    )]
    treasury: Account<'info, Treasury>,
    #[account(
        mut,
        seeds=[b"config"],
        bump = config.config_bump,
    )]
    config: Account<'info, Config>,
    system_program: Program<'info, System>,
}

pub fn create_proposal(
    ctx: Context<CreateProposal>,
    title: String,
    desc: String,
    expiry_days: u64,
    min_quorum: u64,
) -> Result<()> {
    ctx.accounts.user_account.check_active()?;

    let accounts = Transfer {
        from: ctx.accounts.creator.to_account_info(),
        to: ctx.accounts.treasury.to_account_info(),
    };

    let cpi_ctx = CpiContext::new(ctx.accounts.system_program.to_account_info(), accounts);

    transfer(cpi_ctx, 1000000)?;

    ctx.accounts.config.check_expiry_day(expiry_days)?;
    ctx.accounts.config.check_quorom(min_quorum)?;

    ctx.accounts.proposal.init(
        ctx.accounts.config.proposal_count.checked_add(1).ok_or(ErrorCode::Overflow)?,
        title,
        desc,
        expiry_days,
        min_quorum,
        ctx.bumps.proposal,
        ctx.accounts.creator.key(),
    )?;

    ctx.accounts.config.add_proposal()
}