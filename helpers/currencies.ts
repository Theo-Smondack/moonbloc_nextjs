import { Currency } from '../types/currency'
import { CGDateFormat, FCADateFormat } from './toolFunctions'

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
  const isFiatTransaction = isFiat(currency)
  // Handle date format
  let formattedDate: string | undefined
  if (date) {
    formattedDate = isFiatTransaction ? FCADateFormat(date) : CGDateFormat(date)
  }
  // Get USD for fiat
  if (isFiatTransaction) {
    const currencyObj = Currencies.find(
      (c) => c.value.toUpperCase() === currency.toUpperCase()
    )
    if (!currencyObj) throw new Error('Currency not found')
    if (currencyObj.value !== 'USD') {
      const url = new URL(
        `${process.env.HOME_URL}/api/usdRate?currency=${currencyObj.value}${
          formattedDate ? `&date=${formattedDate}` : ''
        }`
      )
      try {
        return await fetch(url).then((res) => res.json())
      } catch (error) {
        console.error(error)
        throw new Error('Error fetching fiat currency rate')
      }
    } else {
      return 1
    }
    // Get USD rate for crypto
  } else {
    const url = new URL(
      `${process.env.HOME_URL}/api/cryptocurrency/price/${currency}${
        formattedDate ? `?date=${formattedDate}` : ''
      }`
    )
    try {
      return await fetch(url).then((res) => {
        return res.json()
      })
    } catch (error) {
      console.error(error)
      throw new Error('Error fetching crypto currency rate')
    }
  }
}
