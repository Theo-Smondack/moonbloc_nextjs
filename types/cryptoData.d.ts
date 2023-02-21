export type CryptoData = {
    id:number;
    market_cap_rank:number;
    market_cap:number;
    percent_change_1h:number;
    percent_change_24h:number;
    percent_change_7d:number;
    volume_24h:number;
    price:number;
    image:string;
    name:string;
    symbol:string;
    total_supply:number;
}

export type CryptoDataList = CryptoData[]

export type CryptoDataInfo = {
    id:string;
    name:string;
    price:number;
    price_change_percentage_24h:number;
    symbol:string;
    description:string;
    logo:string;
    urls:{
        website:string[];
        explorer:string[];
        source_code:string[];
        message_board:string[];
    }

}

export type CryptoDataUrls = CryptoDataInfo['urls']