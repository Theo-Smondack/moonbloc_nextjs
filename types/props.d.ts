import {Property} from "csstype";
import Position = Property.Position;
import {ReactNode} from "react";

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