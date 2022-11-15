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