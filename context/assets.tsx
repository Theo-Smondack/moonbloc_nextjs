import {createContext, useContext, useState} from "react";
import {IProps} from "../types/props";
import {AssetList} from "../types/wallet";

type AssetsContextType = {
    assets: AssetList,
    setAssets: (assets: AssetList) => void
}


const AssetsContext = createContext<AssetsContextType|undefined>(undefined);

const AssetsProvider = ({children}:IProps) => {
    const [assets, setAssets] = useState<AssetList>([]);
    const value = {
        assets: assets,
        setAssets: setAssets
    }
    return <AssetsContext.Provider value={value}>{children}</AssetsContext.Provider>
};

export function useAssetsContext() {
    return useContext(AssetsContext) as AssetsContextType;
}

export default AssetsProvider;