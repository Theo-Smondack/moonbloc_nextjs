export interface Currency {
    name: string;
    value: string;
    symbol: string;
}

export type CurrencyContextType = {
    state: {
        currency: Currency | undefined;
    },
    setCurrency: (currency : Currency) => void;
}