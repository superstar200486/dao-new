"use client"

import React, {
    Dispatch,
    SetStateAction,
    createContext,
    useContext,
    useEffect,
    useState
} from "react";
import { useRouter } from "next/navigation";
import bs58 from "bs58";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

import type { Config } from "../_types";
import { useProgramContext } from "./programContextProvider";
import { getStatus } from "../_utils";

type ConfigContext = {
  config: Config | undefined,
  setConfig: Dispatch<SetStateAction<Config | undefined>>
}

const ConfigContext = createContext<ConfigContext | undefined>(undefined);

const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const wallet = useAnchorWallet();
  const program = useProgramContext();
  const [config, setConfig] = useState<Config | undefined>(undefined);
  const router = useRouter();
 
  useEffect(() => {
    if (wallet) {  
      updateConfig();
    } else {
      setConfig(undefined);
    }
  }, [wallet, program])
  
  const updateConfig = async () => {
    let config = await program?.account.config.all();
    
    if (config?.length === 1) {
      let fetchedConf = config[0].account;

      setConfig({
        issue_price: fetchedConf.issuePrice.toNumber(),
        issue_amount: fetchedConf.issueAmount.toNumber(),
        proposal_fee: fetchedConf.proposalFee.toNumber(),
        min_quorum: fetchedConf.minQuorum.toNumber(),
        max_expiry: Math.floor(fetchedConf.maxExpiry.toNumber()/86400),
        proposal_count: fetchedConf.proposalCount.toNumber(),
        admin: false,
        user: undefined
      });

      if (config[0].account.admin.toString() === wallet?.publicKey.toString()) {
        
        setConfig((state: Config | undefined) => ({
          ...state,
          admin: true,
        } as Config));

      } else {
        let buf = wallet?.publicKey.toBuffer();

        if (buf) {
          let user = await program?.account.user.all([
            {
                memcmp: {
                    offset: 8,
                    bytes: bs58.encode(buf),
                },
            },
          ]);

          if (user?.length === 1) {
              setConfig((state: Config | undefined) => ({
                ...state,
                user: {
                  name: user && user[0].account.name,
                  status: user && getStatus(user[0]),
                }
              } as Config));
          }
          else {
            setConfig((state: Config | undefined) => ({
              ...state,
              user: undefined,
              admin: false
            } as Config));
          }
        }
      }
    } else {
      setConfig(undefined);
      router.push("/init");
    }
  };
  
  return (
    <ConfigContext.Provider value={{config, setConfig}}>
      {children}
    </ConfigContext.Provider>
  )
}

export default ConfigProvider;

export function useConfigContext() {
  return useContext(ConfigContext);
}