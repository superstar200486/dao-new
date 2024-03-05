use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token};
use crate::state::*;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    initializer: Signer<'info>,
    #[account(
        init,
        payer = initializer,
        seeds=[b"auth", config.key().as_ref()],
        bump,
        space = Auth::LEN,
    )]
    auth: Account<'info, Auth>,
    #[account(
        init,
        payer = initializer,
        seeds=[b"treasury", config.key().as_ref()],
        bump,
        space = Treasury::LEN,
    )]
    treasury: Account<'info, Treasury>,
    #[account(
        init,
        payer = initializer,
        seeds = [b"mint", config.key().as_ref()],
        bump,
        mint::authority = auth,
        mint::decimals = 0,
    )]
    mint: Account<'info, Mint>,
    #[account(
        init,
        payer = initializer,
        seeds=[b"config"],
        bump,
        space = Config::LEN,
    )]
    config: Box<Account<'info, Config>>,
    token_program: Program<'info, Token>,
    system_program: Program<'info, System>,
}

pub fn init(
    ctx: Context<Initialize>,
    issue_price: u64,
    issue_amount: u64,
    proposal_fee: u64,
    max_supply: u64,
    min_quorum: u64,
    max_expiry_days: u64,
) -> Result<()> {
    ctx.accounts.config.init(
        ctx.accounts.initializer.key(),
        issue_price,
        issue_amount,
        proposal_fee,
        max_supply,
        min_quorum,
        max_expiry_days,
        ctx.bumps.auth,
        ctx.bumps.config,
        ctx.bumps.mint,
        ctx.bumps.treasury,
    )
}
