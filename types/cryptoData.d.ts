interface changeCurrency {
    percent_change_1h:number;
    percent_change_24h:number;
    percent_change_7d:number;
    market_cap:number;
    volume_24h:number;
    price:number;
}

interface _Quotes {
    [changeCurrency:string] : changeCurrency
}

export type CryptoData = {
    id:number;
    cmc_rank:number;
    name:string;
    symbol:string;
    [quote:string]:_Quotes;
    total_supply:number;
}

export type CryptoDataList = CryptoData[]

export type CryptoDataInfo = {
    id:string;
    name:string;
    symbol:string;
    description:string;
    logo:string;
    urls:{
        website:string[];
        twitter:string[];
        explorer:string[];
        source_code:string[];
        technical_doc:string[];
        message_board:string[];
    }

}

export type CryptoDataUrls = CryptoDataInfo['urls']