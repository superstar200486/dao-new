use anchor_lang::{prelude::*, system_program::{Transfer, transfer}};
use anchor_spl::{token::{Token, TokenAccount, MintTo, mint_to, Mint}, associated_token::AssociatedToken};
use crate::state::*;

#[derive(Accounts)]
pub struct MintTokens<'info> {
    #[account(mut)]
    user: Signer<'info>,
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = user
    )]
    user_ata: Account<'info, TokenAccount>,
    #[account(
        seeds=[b"user", user.key().as_ref()],
        bump = user_account.user_bump,
    )]
    user_account: Account<'info, User>,
    #[account(
        seeds=[b"auth", config.key().as_ref()],
        bump = config.auth_bump,
    )]
    auth: Account<'info, Auth>,
    #[account(
        mut,
        seeds=[b"treasury", config.key().as_ref()],
        bump = config.treasury_bump
    )]
    treasury: Account<'info, Treasury>,
    #[account(
        mut,
        seeds=[b"mint", config.key().as_ref()],
        bump = config.mint_bump
    )]
    mint: Account<'info, Mint>,
    #[account(
        seeds=[b"config"],
        bump = config.config_bump
    )]
    config: Box<Account<'info, Config>>,
    token_program: Program<'info, Token>,
    associated_token_program: Program<'info, AssociatedToken>,
    system_program: Program<'info, System>
}

pub fn mint_tokens(ctx: Context<MintTokens>) -> Result<()> {

    ctx.accounts.user_account.check_active()?;

    let accounts = Transfer {
        from: ctx.accounts.user.to_account_info(),
        to: ctx.accounts.treasury.to_account_info(),
    };

    let cpi_ctx = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        accounts,
    );

    transfer(cpi_ctx, ctx.accounts.config.issue_price)?;

    let accounts = MintTo {
        mint: ctx.accounts.mint.to_account_info(),
        to: ctx.accounts.user_ata.to_account_info(),
        authority: ctx.accounts.auth.to_account_info(),
    };

    let seeds = &[
        &b"auth"[..],
        &ctx.accounts.config.key().to_bytes()[..],
        &[ctx.accounts.config.auth_bump],
    ];

    let signer_seeds = &[&seeds[..]];

    let cpi_ctx = CpiContext::new_with_signer(
        ctx.accounts.system_program.to_account_info(),
        accounts,
        signer_seeds
    );

    mint_to(cpi_ctx, ctx.accounts.config.issue_amount)
}