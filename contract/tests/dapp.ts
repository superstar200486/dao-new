import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { Dapp } from "../target/types/dapp";
import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { PublicKey,Keypair } from '@solana/web3.js';
import { config } from "chai";

const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);
const program = anchor.workspace.Dapp as Program<Dapp>;
const programProvider = program.provider as anchor.AnchorProvider;
const myProgramId = new PublicKey("DG9BfLNAHbvibtSdHvyNcuf2VhVnAckxmmKLvqsqAo7J");
const initializer = provider.wallet;

describe("dapp", async () => {

  const [config, ] = PublicKey.findProgramAddressSync([Buffer.from("config")], myProgramId);
  const [auth, ] = PublicKey.findProgramAddressSync([Buffer.from("auth"), config.toBytes()], myProgramId);
  const [treasury, ] = PublicKey.findProgramAddressSync([Buffer.from("treasury"), config.toBytes()], myProgramId);
  const [mint, ] = PublicKey.findProgramAddressSync([Buffer.from("mint"), config.toBytes()], myProgramId);
  const [user_account, ] = PublicKey.findProgramAddressSync([Buffer.from("user"), initializer.publicKey.toBytes()], myProgramId);
  const user_token_account = await getAssociatedTokenAddress(mint, initializer.publicKey);

  it("Is initialized!", async () => {
    // Add your test here.
    const numbers = [100000000, 1, 100000000, 10000, 5, 10];
    // const bnNumbers = numbers.map(num => BigNumber.from(num));

    // const initializer = anchor.web3.Keypair.generate();
    // const config = anchor.web3.Keypair.generate();
    
    const tx = await program.methods
    .initialize(
      new BN(100000000), new BN(1), new BN(100000000), new BN(10000), new BN(5), new BN(10),
    )
    .accounts({
        initializer: initializer.publicKey,
        auth: auth,
        treasury: treasury,
        mint: mint,
        config: config,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      }
    )
    .signers([])
    .rpc();
    
    
  });
  it("Account Created!", async () => {
    
    const tx = await program.methods
    .createUserAccount(
      "superstar"
    )
    .accounts({
        signer: initializer.publicKey,
        userAccount: user_account,
        userTokenAccount: user_token_account,
        mint: mint,
        config: config,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      }
    )
    .signers([])
    .rpc();
  });
  it("Activated User!", async () => {
    const tx = await program.methods
    .activateUser(
      initializer.publicKey
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
    
  });

  it("token minted!", async () => {
    const tx = await program.methods
    .mintTokens()
    .accounts({
      user: initializer.publicKey,
      userAta: user_token_account,
      userAccount: user_account,
      auth: auth,
      treasury,
      mint,
      config,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
      })
    .signers([])
    .rpc();
    
    const accounts = await program.account.user.all();
  });

  it("create proposal", async () => {
    const t = await program.account.treasury.all();
    
    const [proposal1,] = PublicKey.findProgramAddressSync([Buffer.from("proposal"), initializer.publicKey.toBytes(), new anchor.BN(1).toArrayLike(Array,"le",8)], myProgramId);
    const tx = await program.methods
        .createProposal('title1', "this is desc1", new BN(9), new BN(6))
        .accounts({
            creator: initializer.publicKey,
            userAccount: user_account,
            proposal: proposal1,
            treasury: treasury,
            config,
            systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([])
        .rpc();
        const [proposal2,] = PublicKey.findProgramAddressSync([Buffer.from("proposal"), initializer.publicKey.toBytes(), new anchor.BN(2).toArrayLike(Array,"le",8)], myProgramId);
    const tx1 = await program.methods
        .createProposal('title2', "this is desc2", new BN(9), new BN(6))
        .accounts({
            creator: initializer.publicKey,
            userAccount: user_account,
            proposal: proposal2,
            treasury: treasury,
            config,
            systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([])
        .rpc();
        const [proposal3,] = PublicKey.findProgramAddressSync([Buffer.from("proposal"), initializer.publicKey.toBytes(), new anchor.BN(3).toArrayLike(Array,"le",8)], myProgramId);
    const tx2 = await program.methods
        .createProposal('title3', "this is desc3", new BN(9), new BN(6))
        .accounts({
            creator: initializer.publicKey,
            userAccount: user_account,
            proposal: proposal3,
            treasury: treasury,
            config,
            systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([])
        .rpc();
        const [proposal4,] = PublicKey.findProgramAddressSync([Buffer.from("proposal"), initializer.publicKey.toBytes(), new anchor.BN(4).toArrayLike(Array,"le",8)], myProgramId);
    const tx3 = await program.methods
        .createProposal('title4', "this is desc4", new BN(9), new BN(6))
        .accounts({
            creator: initializer.publicKey,
            userAccount: user_account,
            proposal: proposal4,
            treasury: treasury,
            config,
            systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([])
        .rpc();
    //     const [proposal5,] = PublicKey.findProgramAddressSync([Buffer.from("proposal"), initializer.publicKey.toBytes(), new anchor.BN(5).toArrayLike(Array,"le",8)], myProgramId);
    // const tx4 = await program.methods
    //     .createProposal('title5', "this is desc5", new BN(9), new BN(6))
    //     .accounts({
    //         creator: initializer.publicKey,
    //         userAccount: user_account,
    //         proposal: proposal5,
    //         treasury: treasury,
    //         config,
    //         systemProgram: anchor.web3.SystemProgram.programId,
    //     })
    //     .signers([])
    //     .rpc();
    //     const [proposal6,] = PublicKey.findProgramAddressSync([Buffer.from("proposal"), initializer.publicKey.toBytes(), new anchor.BN(6).toArrayLike(Array,"le",8)], myProgramId);
    // const tx5 = await program.methods
    //     .createProposal('title6', "this is desc6", new BN(9), new BN(6))
    //     .accounts({
    //         creator: initializer.publicKey,
    //         userAccount: user_account,
    //         proposal: proposal6,
    //         treasury: treasury,
    //         config,
    //         systemProgram: anchor.web3.SystemProgram.programId,
    //     })
    //     .signers([])
    //     .rpc();
        // const pros = await program?.account.proposal.all();
        // pros.forEach(p => console.log(JSON.stringify(p)))
        
  })

  it("approve proposal", async () => {
    const [proposal1,] = PublicKey.findProgramAddressSync([Buffer.from("proposal"), initializer.publicKey.toBytes(), new anchor.BN(1).toArrayLike(Array,"le",8)], myProgramId);
    
    const tx = await program.methods
    .approveProposal(new anchor.BN(1), initializer.publicKey)
    .accounts({
        signer: initializer.publicKey,
        proposal: proposal1,
        config: config,
        systemProgram: anchor.web3.SystemProgram.programId,
    }
    )
    .signers([])
    .rpc();
    const pros = await program?.account.proposal.all([{
      memcmp: {
       offset: 8, // Discriminator.
       bytes: initializer.publicKey.toBase58(),
      },
     }]);
    pros.forEach(p => { console.log(JSON.stringify(p)) });
    const pendings = await program?.account.proposal.all([{
      memcmp: {
       offset: 40, // Discriminator.
       bytes: "2",
      },
     }]);
    pendings.forEach(v => console.log(JSON.stringify(v)));
    
  })
});