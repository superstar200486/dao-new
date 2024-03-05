"use client"
import { useEffect, useState } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { redirect } from "next/navigation";
import { PublicKey } from "@solana/web3.js";

import { useProgramContext } from "@/app/_providers/programContextProvider"
import { ProgramId } from "@/app/_constants";
import { useConfigContext } from "@/app/_providers/configProvider";
import { mintToken } from "@/app/_web3/manageTokens";
import { useSnackBarContext } from "@/app/_providers/snackBarProvider";
import TokenTransferModal from "@/app/_components/tokenTransferModal";

const Profile = () => {
    const [solAmount, setSolAmount] = useState<number>(0);
    const [tokenAmount, setTokenAmount] = useState<number>(0);
    const [open, setOpen] = useState<boolean>(false);
    const program = useProgramContext();
    const wallet = useAnchorWallet();
    const config = useConfigContext()?.config;
    const snackBar = useSnackBarContext();

    const getProfile = async() => {
        if (wallet?.publicKey) {
            const user = await program?.account.user.all([
                {
                    memcmp: {
                        offset: 8,
                        bytes: wallet?.publicKey.toBase58(),
                    }
                }
            ]);
            if (user?.length === 1) {
                const [config,] = PublicKey.findProgramAddressSync([Buffer.from("config")], ProgramId);
                const [mint,] = PublicKey.findProgramAddressSync([Buffer.from("mint"), config.toBytes()], ProgramId);
                const user_token_account = await getAssociatedTokenAddress(mint, wallet.publicKey);

                let sol: number | undefined = await program?.provider.connection.getBalance(wallet.publicKey);
                const info = await program?.provider.connection.getTokenAccountBalance(user_token_account);
                sol && setSolAmount(parseFloat((sol / 1000000000).toFixed(4)));
                info?.value.amount && setTokenAmount(Number(info.value.amount));
            }
        }
    }

    useEffect(() => {
        if (config?.user) {
            getProfile();
        } else {
            redirect("/");
        }

    }, [config]);

    const mintTokens = async () => {
        const res = program && wallet && await mintToken(program, wallet);
        if (res) {
            await getProfile();
            snackBar.callSnackBar("success", "successfully issued!");
        } else {
            snackBar.callSnackBar("error", "there is an error. please check your status.");
        }
    }

    const getStatusClassName = (status: String | undefined) => {
        switch (status) {
            case "active":
                return "border-green-600 text-green-600"
            case "disable":
                return "border-red-600 text-red-600"
            case "init":
                return "border-blue-600 text-blue-600"
            default:
                break;
        }
    }

    const renderButtons = () => {
        return config?.user?.status === "active" ? (
            <>
                <button 
                    className="float-right p-1 px-3 border-2 border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white"
                    onClick={ () => mintTokens() }
                    >
                    mint
                </button>
                <button 
                    className="float-right p-1 px-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                    onClick={ () => setOpen(true) }
                    >
                    transfer
                </button>
            </>
        ) : null
    }

    return (
        <div className="flex items-center justify-center pt-16 min-h-screen ">
            <div className="flex flex-col gap-y-1 p-14 shadow-2xl w-6/12 bg-white">
                <h3 className="text-center text-3xl mb-4 text-gray-800 bold uppercase">my profile</h3>
                <div className="text-center text-2xl text-gray-800 bold ">{config?.user?.name}</div>
                <div className="text-center">
                    <span  className={`text-xl border-2 p-2 px-8 rounded display inline-block uppercase ${getStatusClassName(config?.user?.status)}`}>
                        {config?.user?.status}
                    </span>
                </div>
                <div className="text-center text-xl rounded border-2 py-2 text-pink-500 border-pink-500">{solAmount} sol</div>
                <div>
                    <span className="p-1 px-3 border-2 border-pink-600 text-pink-600 inline-block">
                        {tokenAmount} * token
                    </span>
                    { renderButtons() }
                </div>
            </div>
            <TokenTransferModal 
                open={open} 
                setClose={ () => setOpen(false)} 
                refresh={ async () => await getProfile() }/>
        </div>
    )
}

export default Profile;