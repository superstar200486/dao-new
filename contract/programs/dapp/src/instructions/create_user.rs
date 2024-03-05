use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
use crate::state::*;
use anchor_spl::{associated_token::AssociatedToken};

#[derive(Accounts)]
pub struct CreateUserAccount<'info> {
    #[account(mut)]
    signer: Signer<'info>,
    #[account(
        init,
        seeds=[b"user", signer.key().as_ref()],
        bump,
        payer = signer,
        space = User::LEN,
    )]
    user_account: Account<'info, User>,
    #[account(
        init,
        payer = signer,
        associated_token::mint = mint,
        associated_token::authority = signer,
    )]
    user_token_account: Account<'info, TokenAccount>,
    #[account(
        seeds=[b"mint", config.key().as_ref()],
        bump = config.mint_bump,
    )]
    mint: Account<'info, Mint>,
    #[account(
        seeds=[b"config"],
        bump = config.config_bump
    )]
    config: Box<Account<'info, Config>>,
    token_program: Program<'info, Token>,
    associated_token_program: Program<'info, AssociatedToken>,
    system_program: Program<'info, System>,
}

pub fn create_user(ctx: Context<CreateUserAccount>, name: String) -> Result<()> {
    ctx.accounts.user_account.create_account(ctx.accounts.signer.key(), name, ctx.bumps.user_account)
}