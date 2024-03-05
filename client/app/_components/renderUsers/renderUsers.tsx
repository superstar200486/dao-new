"use client"
import React, { useEffect, useState, Dispatch, SetStateAction, } from "react";
import { Member } from "../../_types";
import { PublicKey } from "@solana/web3.js";
import { activateUser, disableUser } from "../../_web3/user";
import { useSnackBarContext } from "../../_providers/snackBarProvider";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useProgramContext } from "../../_providers/programContextProvider";

interface TotalUsers {
    init: Member[],
    active: Member[],
    disable: Member[],
}

const RenderUsers = ({members, setMembers}: {members: Member[], setMembers: Dispatch<SetStateAction<Member[]>>}) => {
    const [totalUsers, setTotalUsers] = useState<TotalUsers>({} as TotalUsers);
    const callSnackBar = useSnackBarContext().callSnackBar;
    const admin = useAnchorWallet();
    const program = useProgramContext();

    useEffect(() => {
        const updatedInitUsers: Member[] = [];
        const updatedActiveUsers: Member[] = [];
        const updatedDisabledUsers: Member[] = [];
        
        members.forEach(m => {
            switch (m.status) {
                case 'init':
                    updatedInitUsers.push(m);
                    break;
                case 'active':
                    updatedActiveUsers.push(m);
                    break;
                case 'disable':
                    updatedDisabledUsers.push(m);
                    break;
                default:
                    break;
            }
        });

        setTotalUsers({
            init: updatedInitUsers,
            active: updatedActiveUsers,
            disable: updatedDisabledUsers
        })
    }, [members]);
    
    const disableUser_v1 = async (accKey: PublicKey, userKey: PublicKey) => {
        const tx = admin && program && await disableUser(accKey, userKey, admin, program);
        if (tx) {
            setMembers(members => members.map(m => m.accKey.toString() === accKey.toString() ? {...m, status: "disable"} : m) );
            return callSnackBar("success", "successfully disabled!");
        };
        callSnackBar("error", "there is an error!");
    }

    const activeUser_v1 = async (accKey: PublicKey, userKey: PublicKey) => {
        const tx = admin && program && await activateUser(accKey, userKey, admin, program);
        if (tx) {
            setMembers(members => members.map(m => m.accKey.toString() === accKey.toString() ? {...m, status: "active"} : m) );
            return callSnackBar("success", "successfully activated!");
        };
        callSnackBar("error", "there is an error!");
    }

    const renderUsers = () => {
        return totalUsers ? (
            Object.entries(totalUsers).map(([key, users]) => (
                users.length ? (
                    <div key={key} className="border-2 p-3 border-grey-600 text-center  mb-2">
                        <h3 className="text-2xl font-bold uppercase mb-3">{key} users list</h3>
                        {
                            users.map((u: Member, k: number) => (
                                <div className="flex mb-2" key={k}>
                                    <div className="w-3/5 overflow-hidden">{ u.userkey.toString() }</div>
                                    <div className="w-1/5">{ u.name }</div>
                                    <div className="w-1/5">
                                        {
                                            key === "active" ? 
                                            (<button 
                                                className="p-1 px-3 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white" 
                                                onClick={ () => disableUser_v1(u.accKey, u.userkey) }>
                                                    disable
                                            </button>) : 
                                            (<button 
                                                className="p-1 px-3 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white" 
                                                onClick={ () => activeUser_v1(u.accKey, u.userkey) }>
                                                    active
                                            </button>) 
                                        }
                                    </div>
                                </div>
                            ))
                        }
                        </div>
                ) : null
            ))
        ) : null;
    }

    return (
        <div className="flex flex-col ">
            { renderUsers() }
        </div>
    )
}

export default RenderUsers;