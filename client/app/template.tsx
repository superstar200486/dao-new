"use client"

import {
  useConnection,
  useAnchorWallet
} from "@solana/wallet-adapter-react"
import { useRouter } from 'next/navigation'
import { useEffect } from "react";
import SideBar from "./_components/navBar";

const Template: React.FC = ({children}: any) => {
    return (
        <div className="min-h-screen">
            <SideBar />
            <div className="w-full">
                {children}
            </div>
        </div>
    )
}

export default Template;