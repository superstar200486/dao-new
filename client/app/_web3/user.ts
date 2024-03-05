import * as anchor from "@coral-xyz/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import {
    getAssociatedTokenAddress,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { ProgramId } from "@/app/_constants";

export const registerUser = async (name: string, program: any, signer: AnchorWallet) => {
    const [user_account,] = PublicKey.findProgramAddressSync([Buffer.from("user"), signer.publicKey.toBytes()], ProgramId);
    const [config,] = PublicKey.findProgramAddressSync([Buffer.from("config")], ProgramId);
    const [mint,] = PublicKey.findProgramAddressSync([Buffer.from("mint"), config.toBytes()], ProgramId);
    const user_token_account = await getAssociatedTokenAddress(mint, signer.publicKey);

    try{
        const tx = await program.methods
        .createUserAccount(name)
        .accounts({
            signer: signer.publicKey,
            userAccount: user_account,
            userTokenAccount: user_token_account,
            mint: mint,
            config: config,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([])
        .rpc();
        
        return tx ?  true: false; 
    } catch (e) {
        return false;
    }
        
}
export const disableUser = async (accKey: anchor.web3.PublicKey, userkey: PublicKey,initializer: AnchorWallet, program: any) => {
    if (program && initializer) {
        const user_account = accKey.toBase58();
        const [config,] = PublicKey.findProgramAddressSync([Buffer.from("config")], ProgramId);

        try{
            const tx = await program?.methods
            .disableUser(
                userkey
            )
            .accounts({
                signer: initializer.publicKey,
                userAccount: user_account,
                config: config,
                systemProgram: anchor.web3.SystemProgram.programId,
            }
            )
            .signers([])
            .rpc();
            return tx ?  true: false; 
        } catch {
            return false;
        }
    }
    return false;
}

export const activateUser = async (accKey: anchor.web3.PublicKey, userkey: PublicKey, initializer: AnchorWallet, program: any) => {
    
    if (program && initializer) {
        const user_account = accKey.toBase58();
        const [config,] = PublicKey.findProgramAddressSync([Buffer.from("config")], ProgramId);
        
        try{
            const tx = await program?.methods
            .activateUser(
                userkey
            )
            .accounts({
                signer: initializer.publicKey,
                userAccount: user_account,
                config: config,
                systemProgram: anchor.web3.SystemProgram.programId,
            }
            )
            .signers([])
            .rpc();
            return tx ?  true: false; 
        } catch {
            return false;
        }
    }
    return false;

}