"use client"
import { useAnchorWallet } from "@solana/wallet-adapter-react";

export default function Page() {
    const wallet = useAnchorWallet();

    return (
        <div className="flex items-center justify-center w-full min-h-screen">
            {
                wallet ?
                (<h1 className="p-14 shadow-2xl w-6/12 text-3xl text-center bold text-pink-600">
                    Welcome To Our Website!
                </h1>) :
                (<h1 className="p-14 shadow-2xl w-6/12 text-3xl text-center bold">
                    please connect your wallet
                </h1>)
            }
        </div> 
    )
}
