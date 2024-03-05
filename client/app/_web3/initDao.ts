import * as anchor from "@coral-xyz/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { ProgramId } from "@/app/_constants";
import { InitFormData } from "../(pages)/init/page";

export const initDao = async (data: InitFormData, program: any, initializer: AnchorWallet) => {
    const { 
        issuePrice, 
        issueAmount, 
        proposalFee, 
        maxSupply, 
        minQuorum, 
        maxExpiry 
    } = data;
    const [config,] = PublicKey.findProgramAddressSync([Buffer.from("config")], ProgramId);
    const [mint,] = PublicKey.findProgramAddressSync([Buffer.from("mint"), config.toBytes()], ProgramId);
    const [auth, ] = PublicKey.findProgramAddressSync([Buffer.from("auth"), config.toBytes()], ProgramId);
    const [treasury, ] = PublicKey.findProgramAddressSync([Buffer.from("treasury"), config.toBytes()], ProgramId);
    
    try{
        const tx = await program.methods
        .initialize(
            new anchor.BN(issuePrice), 
            new anchor.BN(issueAmount), 
            new anchor.BN(proposalFee), 
            new anchor.BN(maxSupply), 
            new anchor.BN(minQuorum), 
            new anchor.BN(maxExpiry), 
        )
        .accounts({
            initializer: initializer.publicKey,
            auth,
            treasury,
            mint,
            config,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([])
        .rpc();
        
        return tx ? true : false;
    } catch (e) {
        return false;
    }
}