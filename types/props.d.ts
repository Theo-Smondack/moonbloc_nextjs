import {Property} from "csstype";
import Position = Property.Position;
import React, {ReactNode} from "react";
import {CryptoDataUrls} from "./cryptoData";

type IProps = {
    children:ReactNode;
}

type CurrencyModalProps = {
    pos:Position|undefined;
}

type CryptotableProps = {
    page:number|undefined;
}

type PaginationProps = {
    currentPage:number;
    pageCallback:(paginationPage:number) => void;
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