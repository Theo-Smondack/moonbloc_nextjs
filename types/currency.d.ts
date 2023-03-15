export interface Currency {
    name: string;
    value: string;
    symbol: string;
    image: string;
}

export type CurrencyContextType = {
    state: {
        currency: Currency | undefined;
    },
    setCurrency: (currency: Currency) => void;
}