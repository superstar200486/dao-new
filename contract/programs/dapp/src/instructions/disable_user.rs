use anchor_lang::prelude::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction(_userkey: Pubkey)]
pub struct DisableUser<'info> {
    #[account(mut)]
    signer: Signer<'info>,
    #[account(
        mut,
        seeds=[b"user", _userkey.as_ref()],
        bump = user_account.user_bump,
    )]
    user_account: Account<'info, User>,
    #[account(
        seeds=[b"config"],
        bump = config.config_bump,
        constraint = config.admin == signer.key(),
    )]
    config: Box<Account<'info, Config>>,
    system_program: Program<'info, System>,
}

pub fn disable_user(ctx: Context<DisableUser>) -> Result<()> {
    ctx.accounts.user_account.disable_user()
}