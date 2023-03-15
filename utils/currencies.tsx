import {Currency} from "../types/currency";

const Currencies: Currency[] = [
    {
        name: 'United State Dollar',
        value: 'USD',
        symbol: '$',
        image: "/../public/images/currency_logo/icons8-dollar-américain-encerclé-50.png"
    },
    {
        name: 'Euro',
        value: 'EUR',
        symbol: '€',
        image: "/../public/images/currency_logo/icons8-euro-50.png"
    },
    {
        name: 'Pound Sterling',
        value: 'GBP',
        symbol: '£',
        image: "/../public/images/currency_logo/icons8-livre-sterling-50.png"
    },
    {
        name: 'Swiss Franc',
        value: 'CHF',
        symbol: 'CHF',
        image: "/../public/images/currency_logo/icons8-franc-suisse-50.png"
    },
    {
        name: 'Canadian Dollar',
        value: 'CAD',
        symbol: '$',
        image: "/../public/images/currency_logo/icons8-dollar-canadien-50.png"
    },
    {
        name: 'Japanese Yen',
        value: 'JPY',
        symbol: '¥',
        image: "/../public/images/currency_logo/icons8-yen-japonais-50.png"
    },
    {
        name: 'Chinese Yuan',
        value: 'CNY',
        symbol: 'CN¥',
        image: "/../public/images/currency_logo/icons8-yuan-50.png"
    }
]

export default Currencies;