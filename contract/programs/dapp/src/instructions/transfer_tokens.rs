use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{transfer as transfer_spl, Mint, Token, TokenAccount, Transfer as TransferSpl},
};

use crate::state::*;

#[derive(Accounts)]
#[instruction(_receiver: Pubkey)]
pub struct TransferSPLTokens<'info> {
    #[account[mut]]
    sender: Signer<'info>,
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = sender,
    )]
    sender_ata: Account<'info, TokenAccount>,
    #[account[
        mut,
        associated_token::mint = mint,
        associated_token::authority = _receiver,
    ]]
    receiver_ata: Account<'info, TokenAccount>,
    #[account(
        mut,
        seeds = [b"mint", config.key().as_ref()],
        bump = config.mint_bump,
    )]
    mint: Account<'info, Mint>,
    #[account(
        seeds = [b"config"],
        bump = config.config_bump,
    )]
    config: Account<'info, Config>,
    token_program: Program<'info, Token>,
    associated_token_program: Program<'info, AssociatedToken>,
    system_program: Program<'info, System>,
}

pub fn transfer_tokens(
    ctx: Context<TransferSPLTokens>, 
    amount: u64,
) -> Result<()> {
    let accounts = TransferSpl {
        from: ctx.accounts.sender_ata.to_account_info(),
        to: ctx.accounts.receiver_ata.to_account_info(),
        authority: ctx.accounts.sender.to_account_info(),
    };

    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        accounts,
    );

    transfer_spl(cpi_ctx, amount)
}