import React, {createContext, useContext, useState} from "react";
import {AuthModalContextType, ModalState} from "../types/authentication";

interface IProps {
    children: React.ReactNode;
}


export const AuthModalContext = createContext<AuthModalContextType | null>(null);

const AuthModalProvider = ({children}: IProps) => {
    const [modalState, setModalState] = useState<ModalState>({show: false});
    const value = {
        modalState: modalState,
        setModalState: setModalState
    }
    return <AuthModalContext.Provider value={value}>{children}</AuthModalContext.Provider>;
}

export function useAuthModalContext() {
    return useContext(AuthModalContext) as AuthModalContextType;
}

export default AuthModalProvider;