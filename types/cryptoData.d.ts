export type CryptoDataCG = {
  id: string
  market_cap_rank: number
  market_cap: number
  price_change_percentage_1h_in_currency: number
  price_change_percentage_24h_in_currency: number
  price_change_percentage_7d_in_currency: number
  total_volume: number
  current_price: number
  image: string
  name: string
  symbol: string
  total_supply: number
}

export type CryptoData = {
  id: string
  market_cap_rank: number
  market_cap: number
  percent_change_1h: number
  percent_change_24h: number
  percent_change_7d: number
  volume_24h: number
  price: number
  image: string
  name: string
  symbol: string
  total_supply: number
}

export type CryptoDataList = CryptoData[]

export type CryptoDataInfo = {
  id: string
  name: string
  price: number
  price_change_percentage_24h: number
  symbol: string
  description: string
  logo: string
  urls: {
    website: string[]
    explorer: string[]
    source_code: string[]
    message_board: string[]
  }
}

export type CryptoDataUrls = CryptoDataInfo['urls']
