import { Schema, models, model } from 'mongoose'

export interface ohlcData {
  time: number
  open: number
  high: number
  low: number
  close: number
}

export interface urls {
  website: string
  explorer: string
  source_code: string
  message_board: string
}

export interface CryptocurrencyInput {
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
  ohlcData?: ohlcData[]
  urls?: urls
  description?: string
}

export class CryptocurrencyClass implements CryptocurrencyInput {
  public id: string
  public market_cap_rank: number
  public market_cap: number
  public percent_change_1h: number
  public percent_change_24h: number
  public percent_change_7d: number
  public volume_24h: number
  public price: number
  public image: string
  public name: string
  public symbol: string
  public total_supply: number
  public ohlcData?: ohlcData[]
  public urls?: urls
  public description?: string
  constructor(
    id: string,
    market_cap_rank: number,
    market_cap: number,
    percent_change_1h: number,
    percent_change_24h: number,
    percent_change_7d: number,
    volume_24h: number,
    price: number,
    image: string,
    name: string,
    symbol: string,
    total_supply: number,
    ohlcData?: ohlcData[],
    urls?: urls,
    description?: string
  ) {
    this.id = id
    this.market_cap_rank = market_cap_rank
    this.market_cap = market_cap
    this.percent_change_1h = percent_change_1h
    this.percent_change_24h = percent_change_24h
    this.percent_change_7d = percent_change_7d
    this.volume_24h = volume_24h
    this.price = price
    this.image = image
    this.name = name
    this.symbol = symbol
    this.total_supply = total_supply
    this.ohlcData = ohlcData
    this.urls = urls
    this.description = description
  }
}

export interface CryptocurrencyDocument extends CryptocurrencyClass, Document {
  createdAt: Date
  updatedAt: Date
}

const CryptocurrencySchema: Schema = new Schema(
  {
    id: { type: String, required: true },
    market_cap_rank: { type: Number, required: true },
    market_cap: { type: Number, required: true },
    percent_change_1h: { type: Number, required: true },
    percent_change_24h: { type: Number, required: true },
    percent_change_7d: { type: Number, required: true },
    volume_24h: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    total_supply: { type: Number, required: true },
    ohlcData: { type: Array, required: false },
    urls: { type: Object, required: false },
    description: { type: String, required: false },
  },
  {
    timestamps: true,
  }
)

CryptocurrencySchema.index({
  id: 1,
  image: 1,
  price: 1,
  symbol: 1,
  market_cap_rank: 1,
})

export default models.Cryptocurrency ||
  model<CryptocurrencyDocument>('Cryptocurrency', CryptocurrencySchema)
