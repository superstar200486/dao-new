"use client"

import Link from "next/link";
import { useConfigContext } from "@/app/_providers/configProvider";
import dynamic from 'next/dynamic';
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import StatusMarker from "../statusMaker/statusMaker";
    
const WalletMultiButton = dynamic(() => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton), {
    ssr: false
});

const SideBar: React.FC = () => {
    const config = useConfigContext()?.config;
    const wallet = useAnchorWallet();
    const router = useRouter();
    useEffect(() => {
        if (config?.admin) {
            router.push("/admin/manage-proposals");
        } else if (config?.user) {
            router.push("/member/profile");
        } else if (config && wallet) {
            router.push("/user/register");
        } else if (!config && wallet) {
            router.push("/init");
        } else {
            router.push("/");
        }
    }, [config])

    const renderLinks = () => {
        if (config?.admin) {
            return (
                <>
                    <Link className="text-2xl text-white text-white px-6 py-4 uppercase text-center" href="/admin/manage-members">manage members</Link>
                    <Link className="text-2xl text-white text-white px-6 py-4 uppercase text-center" href="/admin/manage-proposals">manage proposals</Link>
                    <Link className="text-2xl text-white text-white px-6 py-4 uppercase text-center" href="/proposals">proposals</Link>
                    
                </>
            )
        } else if (config?.user) {
            return (
                <>
                    <Link className="text-2xl text-white text-white px-6 py-4 uppercase text-center" href="/member/own-proposals">my proposals</Link>
                    <Link className="text-2xl text-white text-white px-6 py-4 uppercase text-center" href="/member/profile">my profile</Link>
                    <Link className="text-2xl text-white text-white px-6 py-4 uppercase text-center" href="/proposals">proposals</Link>
                </>
            )
        } else if (config && wallet) {
            return (
                <>
                    <Link className="text-2xl text-white text-white px-6 py-4 uppercase text-center" href="/user/register">register</Link>
                    <Link className="text-2xl text-white text-white px-6 py-4 uppercase text-center" href="/proposals">proposals</Link>
                </>
            )

        } else if (!config && wallet) {
            return (
                <Link className="text-2xl text-white text-white px-6 py-4 uppercase text-center" href="/init">init</Link>
            )
        }
    }

    return (
        <nav className="p-0 group w-full flex shadow-xl fixed bg-gray-600">
            <div className="w-1/5 p-4">
                <div className="text-center"><StatusMarker /></div>
            </div>
            <div className="flex flex-row-reverse w-4/5">
                <div className="text-center">
                    <WalletMultiButton />
                </div>
                { renderLinks() }
            </div>
        </nav>
    )
}   

export default SideBar;