import {createContext, useContext, useState} from "react";
import CurrenciesObject from "../utils/currencies";


export const CurrencyContext = createContext({});


export function CurrencyProvider({children}) {
    const Currencies = CurrenciesObject;
    const [currencySelected,setCurrencySelected] = useState('USD');

    const value = {
        state : {
            currency : Currencies[currencySelected],
            currencySelected:currencySelected,
        },
        setCurrencySelected:setCurrencySelected,
    }

    return(
        <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
    );
}

export function useCurrencyContext() {
    return useContext(CurrencyContext);
}