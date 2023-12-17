import { Currency } from '../types/currency'

const Currencies: Currency[] = [
  {
    name: 'United State Dollar',
    value: 'USD',
    symbol: '$',
    image: '/images/currency_logo/icons8-dollar-américain-encerclé-50.png',
  },
  {
    name: 'Euro',
    value: 'EUR',
    symbol: '€',
    image: '/images/currency_logo/icons8-euro-50.png',
  },
  {
    name: 'Pound Sterling',
    value: 'GBP',
    symbol: '£',
    image: '/images/currency_logo/icons8-livre-sterling-50.png',
  },
  {
    name: 'Swiss Franc',
    value: 'CHF',
    symbol: 'CHF',
    image: '/images/currency_logo/icons8-franc-suisse-50.png',
  },
  {
    name: 'Canadian Dollar',
    value: 'CAD',
    symbol: '$',
    image: '/images/currency_logo/icons8-dollar-canadien-50.png',
  },
  {
    name: 'Japanese Yen',
    value: 'JPY',
    symbol: '¥',
    image: '/images/currency_logo/icons8-yen-japonais-50.png',
  },
  {
    name: 'Chinese Yuan',
    value: 'CNY',
    symbol: 'CN¥',
    image: '/images/currency_logo/icons8-yuan-50.png',
  },
]

export default Currencies

export const isFiat = (currency: string) => {
  return !!Currencies.find(
    (c) => c.value.toUpperCase() === currency.toUpperCase()
  )
}

export const getUSDRate = async (currency: string, date?: string) => {
  const currencyObj = Currencies.find(
    (c) => c.value.toUpperCase() === currency.toUpperCase()
  )
  if (!currencyObj) throw new Error('Currency not found')
  if (currencyObj.value !== 'USD') {
    let url = new URL(
      `${process.env.ENV_URL}/api/usdRate?currency=${currencyObj.value}`
    )
    if (date) {
      url = new URL(
        `${process.env.ENV_URL}/api/usdRate?currency=${currencyObj.value}&date=${date}`
      )
    }
    try {
      return await fetch(url).then((res) => res.json())
    } catch (error) {
      console.error(error)
      throw new Error('Error fetching currency rate')
    }
  } else {
    return 1
  }
}
