import React, {createContext, useContext, useState} from "react";
import {StatusContextType, StatusState} from "../types/status";


interface IProps{
    children:React.ReactNode
}

export const StatusContext = createContext<StatusContextType | null>(null)

const StatusProvider = ({children}:IProps) => {
    const [status,setStatus] = useState<StatusState>({message:"",success:false})
    const value = {
        statusState:status,
        setStatus:setStatus
    }
    return <StatusContext.Provider value={value}>{children}</StatusContext.Provider>

}

export function useStatusContext() {
    return useContext(StatusContext) as StatusContextType

}

export default StatusProvider;