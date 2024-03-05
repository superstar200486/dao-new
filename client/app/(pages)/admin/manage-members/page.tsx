"use client"
import React, { useEffect, useState } from "react";
import { redirect } from 'next/navigation';

import { useConfigContext } from "@/app/_providers/configProvider";
import { useProgramContext } from "@/app/_providers/programContextProvider"
import { getStatus } from "@/app/_utils";
import { Member } from "@/app/_types";
import RenderUsers from "@/app/_components/renderUsers/renderUsers";

const ManageMembers: React.FC = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const program = useProgramContext();
    const config = useConfigContext()?.config;
    
    useEffect(() => {
        if (config?.admin) {
            getMembers();
        } else {
            redirect("/");
        }
    }, [config]);
    
    const getMembers = async () => {
        const fetchedMembers = program ? await program?.account.user.all() : [];
        const newMembers = fetchedMembers?.map(m => ({
            accKey: m.publicKey,
            userkey: m.account.pubkey,
            name: m.account.name,
            status: getStatus(m),
        }));
        setMembers(newMembers);
    }
    
    return (
        <div className="pt-28 min-h-screen p-12">
            <RenderUsers members={members} setMembers={setMembers}/>
        </div>
    )
}

export default ManageMembers;