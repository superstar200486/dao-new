"use client"

import { useConfigContext } from "../../_providers/configProvider";

const StatusMarker: React.FC = () => {
    const config = useConfigContext()?.config;
    const renderMarker = () => {
        if (config?.admin) {
            return (
                <span className="text-2xl border-2 border-pink-600 bg-pink-600 p-2 text-white rounded-full">admin</span>
            )
        } else if (config?.user) {
            switch (config.user.status) {
                case "init":
                    return <span className="text-2xl border-2 border-blue-600 bg-blue-600 p-2 text-white rounded-full shadow-2xl">init</span>
                case "active":
                    return <span className="text-2xl border-2 border-green-600 bg-green-600 p-2 text-white rounded-full">active</span>
                case "disable":
                    return <span className="text-2xl border-2 border-red-600 bg-red-600 p-2 text-white rounded-full">disable</span>
            }
            
        } 
    }
    return  <>{ renderMarker() }</>
}

export default StatusMarker;