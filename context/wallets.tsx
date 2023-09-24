import { createContext, useContext, useState } from 'react';
import { WalletsContextType, WalletsState } from '../types/wallet';
import { IProps } from '../types/props';


const WalletsContext = createContext<WalletsContextType | null>(null);

const WalletsProvider = ({ children }: IProps) => {
    const [wallets, setWallets] = useState<WalletsState>([])
    const value = {
        wallets: wallets,
        setWallets: setWallets,
    }
    return <WalletsContext.Provider value={value}>{children}</WalletsContext.Provider>
}

export function useWalletsContext() {
    return useContext(WalletsContext) as WalletsContextType
}

export default WalletsProvider