import React, { createContext, useContext, useState } from 'react';
import Currencies from '../helpers/currencies';
import { Currency,CurrencyContextType } from '../types/currency';
import { IProps } from '../types/props';


export const CurrencyContext = createContext<CurrencyContextType | null>(null);

const CurrencyProvider = ({ children }: IProps) => {
    const _currency: Currency | undefined = Currencies.find(curr => curr.value === 'USD')

    const [currency, setCurrency] = useState<Currency | undefined>(_currency);

    const value = {
        state: {
            currency: currency,
        },
        setCurrency: setCurrency,
    }


    return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrencyContext() {
    return useContext(CurrencyContext) as CurrencyContextType;
}

export default CurrencyProvider;