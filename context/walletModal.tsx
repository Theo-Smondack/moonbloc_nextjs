import { createContext, useContext, useState } from 'react';
import { WalletModalContextType, WalletModalState } from '../types/wallet';
import { IProps } from '../types/props';


export const WalletModalContext = createContext<WalletModalContextType | null>(null);

const WalletModalProvider = ({ children }: IProps) => {
    const [walletModalState, setWalletModalState] = useState<WalletModalState>({ show: false, type: 'create' });
    const value = {
        state: walletModalState,
        setState: setWalletModalState,
    }
    return <WalletModalContext.Provider value={value}>{children}</WalletModalContext.Provider>;
};

export function useWalletModalContext() {
    return useContext(WalletModalContext) as WalletModalContextType;
}

export default WalletModalProvider;