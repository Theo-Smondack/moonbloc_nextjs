import {Property} from "csstype";
import Position = Property.Position;
import React, {ReactNode} from "react";

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

type profilPopUpProps = {
    refProp:React.RefObject<HTMLDivElement>;
}