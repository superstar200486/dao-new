import * as anchor from "@coral-xyz/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { ProgramId } from "@/app/_constants";
import {
    getAssociatedTokenAddress,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { TransferFormData } from "../_components/tokenTransferModal";

export const mintToken = async (program: any, user: AnchorWallet) => {
    const [config,] = PublicKey.findProgramAddressSync([Buffer.from("config")], ProgramId);
    const [mint,] = PublicKey.findProgramAddressSync([Buffer.from("mint"), config.toBytes()], ProgramId);
    const [auth, ] = PublicKey.findProgramAddressSync([Buffer.from("auth"), config.toBytes()], ProgramId);
    const [treasury, ] = PublicKey.findProgramAddressSync([Buffer.from("treasury"), config.toBytes()], ProgramId);
    const [user_account,] = PublicKey.findProgramAddressSync([Buffer.from("user"), user.publicKey.toBytes()], ProgramId);
    const user_token_account = await getAssociatedTokenAddress(mint, user.publicKey);
    
    try{
        const tx = await program.methods
        .mintTokens()
        .accounts({
            user: user.publicKey,
            userAta: user_token_account,
            userAccount: user_account,
            auth,
            treasury,
            mint,
            config,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([])
        .rpc();
        
        return tx ? true : false;
    } catch (e) {
        return false;
    }
}

export const transferToken = async (data: TransferFormData, program: any, sender: AnchorWallet) => {
    const [config,] = PublicKey.findProgramAddressSync([Buffer.from("config")], ProgramId);
    const [mint,] = PublicKey.findProgramAddressSync([Buffer.from("mint"), config.toBytes()], ProgramId);
    const user_token_account = await getAssociatedTokenAddress(mint, sender.publicKey);
    const receiver = new PublicKey(data.destination);
    const receiver_token_account = await getAssociatedTokenAddress(mint, receiver);

    try{
        const tx = await program.methods
        .transferTokens(receiver, new anchor.BN(data.amount))
        .accounts({
            sender: sender.publicKey,
            senderAta: user_token_account,
            receiverAta: receiver_token_account,
            mint,
            config,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([])
        .rpc();
        
        return tx ? true : false;
    } catch (e) {
        return false;
    }
}