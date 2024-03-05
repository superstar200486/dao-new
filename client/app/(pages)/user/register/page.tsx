"use client"
import React, { useEffect, useState } from "react"; 
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from 'next/navigation';

import { useProgramContext } from "@/app/_providers/programContextProvider";
import { useConfigContext } from "@/app/_providers/configProvider";
import { registerUser } from "@/app/_web3/user";
import { useSnackBarContext } from "@/app/_providers/snackBarProvider";
import { Config, User } from "@/app/_types";
import "./registerPageStyles.css";

interface FormData {
    name: string;
}

const RegisterPage: React.FC = () => {
    const program = useProgramContext();
    const wallet = useAnchorWallet();
    const config = useConfigContext();
    const callSnackBar = useSnackBarContext().callSnackBar;
    const router = useRouter();

    useEffect(() => {
        if (!wallet || config?.config?.user !== undefined || config?.config?.admin !== false) {
            router.push("/");
        }
    }, [config]);

    const submit: SubmitHandler<FormData> = async (data) => {
        if (wallet && program) {
            const res = await registerUser(data.name, program, wallet);
            if (res) {
                callSnackBar("success","succeed! please wait until approve!");
                config?.setConfig((config: Config | undefined) => ({
                    ...config,
                    user: {
                        name: data.name,
                        status: "init"
                    }
                } as Config))
            } else {
                callSnackBar("error", "failure!");
            }
        } else {
            callSnackBar("error", "please select wallet");
        }
    };

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    return (
        <div className="form-container pt-16 min-h-screen ">
            <form className="register-form" onSubmit={handleSubmit(submit)}>
                <h1 className="text-center text-3xl mb-4 text-gray-800 bold">REGISTER</h1>
                <input 
                    className="name-input" 
                    type="text" 
                    {...register("name", { required: true, pattern: /^[a-zA-Z0-9]{0,20}$/})} 
                    placeholder="Enter Your Name"
                />
                {errors.name ? <p className="error">incorrect name(min: 1, max: 20)</p> : null}
                <button className="submit" type="submit">Submit</button>
            </form>
        </div>
    );
}

export default RegisterPage;