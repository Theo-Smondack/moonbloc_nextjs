import {Property} from "csstype";
import Position = Property.Position;
import React, {ReactNode} from "react";
import {CryptoDataUrls} from "./cryptoData";
import {WalletDocument} from "../models/Wallet";
import {Asset, ResponseAsset, WalletResponse} from "./wallet";
import {searchValue} from "../components/portfolio/portfolioPage/assetSelectorModal";

type IProps = {
    children:ReactNode;
}

type CurrencyModalProps = {
    pos:Position|undefined;
}

type CryptotableProps = {
    page:number|undefined;
    isWatchlist:boolean;
}

type PaginationProps = {
    currentPage:number;
    pageCallback:(paginationPage:number) => void;
    totalPages:number;
}

type LayoutProps = {
    children:ReactNode;
}

type AuthButtonsProps = {
    setNavbar?:(state:boolean) => void;
}

type ProfilButtonProps = {
    isOpen?:boolean;
    setNavbar?:(state:boolean) => void;
}

type ProfilPopUpProps = {
    keepOpenCb:()=>void;
    refProp:React.RefObject<HTMLDivElement>;
    closePopUp:()=>void;
}

type CryptoUrlsProps = {
    urls:CryptoDataUrls;
}

type CryptoChartProps = {
    id:string;
}

type WalletModalProps = {
    type: 'create' | 'edit';
    showCallback:(show:boolean,type:WalletModalProps['type'],walletID?:string)=>void;
    walletID?:string;
}
type CardProps = {
    index:number;
    id:string;
    title:string;
}

type CardPopupProps = {
    index:number;
    hoverCallback:(hover:boolean)=>void;
    id:string;

}

type NoAssetWalletProps = {
    walletID:string;
    walletTitle:WalletDocument['walletTitle'];
}

type AssetSelectorProps = {
    title:string;
    showCallback:(show:boolean)=>void;
    addAsset: (asset:searchValue) => void;

}

type TransactionModalProps = {
    showCallback:(show:boolean)=>void;
    setAsset:React.Dispatch<React.SetStateAction<Asset|null>>;
    Asset:Asset;

}

type AssetListProps = {
    Assets:WalletResponse['assets'];
}