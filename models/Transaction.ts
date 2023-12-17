import mongoose, { Schema } from 'mongoose'

// Types imports
import { CryptoData } from '../types/cryptoData'
import { Asset } from '../types/wallet'
import { Currency } from '../types/currency'
import { getUSDRate, isFiat } from '../helpers/currencies'
import { formatDateString, isToday } from '../helpers/toolFunctions'

export interface TransactionInput {
  type: 'buy' | 'sell'
  from: CryptoData['id'] | Currency['value']
  to: CryptoData['id'] | Currency['value']
  quantity: number
  price: number
  date: Date
  fee: number
}

export class TransactionClass implements TransactionInput {
  public type: 'buy' | 'sell'
  public from: CryptoData['id'] | Currency['value']
  public to: CryptoData['id'] | Currency['value']
  public quantity: number
  public price: number
  public date: Date
  public fee: number
  public walletID: mongoose.Types.ObjectId

  constructor(
    type: 'buy' | 'sell',
    from: CryptoData['id'] | Currency['value'],
    to: CryptoData['id'] | Currency['value'],
    quantity: number,
    price: number,
    date: Date,
    fee: number,
    walletID: mongoose.Types.ObjectId
  ) {
    this.type = type
    this.from = from
    this.to = to
    this.quantity = quantity
    this.price = price
    this.date = date
    this.fee = fee
    this.walletID = walletID
  }
}

export interface TransactionDocument extends TransactionClass, Document {
  createdAt: Date
  updatedAt: Date
}

const TransactionSchema: Schema = new Schema(
  {
    type: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    date: { type: Date, required: true },
    fee: { type: Number, required: true },
    walletID: { type: mongoose.Types.ObjectId, ref: 'Wallet', required: true },
  },
  {
    timestamps: true,
  }
)

// Update wallet on creating transaction
TransactionSchema.pre('save', async function () {
  const wallet = await mongoose.models.Wallet.findOne(
    { _id: this.walletID },
    null,
    { lean: true }
  )
  if (!wallet) throw new Error('Wallet not found')
  const assets = wallet.assets
  let totalBuyUSD = wallet.totalBuyUSD ?? 0
  let totalSellUSD = wallet.totalSellUSD ?? 0
  //#region Handle sell transaction
  if (this.type === 'sell') {
    const assetIndex = assets.findIndex(
      (asset: Asset) => asset.id === this.from.toLowerCase()
    )
    assets[assetIndex].quantity -= this.price
    // If selling a crypto to a fiat currency
    if (isFiat(this.to)) {
      let usdRate: number
      const transactionDate = formatDateString(this.date)
      if (isToday(transactionDate)) {
        usdRate = parseFloat(await getUSDRate(this.to))
      } else {
        usdRate = parseFloat(await getUSDRate(this.to, transactionDate))
      }
      totalSellUSD += this.quantity * usdRate
    }
  }
  //#endregion
  //#region Handle buy transaction
  else if (this.type === 'buy') {
    const assetIndex = assets.findIndex(
      (asset: Asset) => asset.id === this.to.toLowerCase()
    )
    if (assetIndex === -1) {
      assets.push({
        id: this.to.toLowerCase(),
        quantity: this.quantity,
      })
    } else {
      assets[assetIndex].quantity += this.quantity
    }
    // If buying a crypto with a fiat currency
    if (isFiat(this.from)) {
      let usdRate: number
      const transactionDate = formatDateString(this.date)
      if (isToday(transactionDate)) {
        usdRate = parseFloat(await getUSDRate(this.from))
      } else {
        usdRate = parseFloat(await getUSDRate(this.from, transactionDate))
      }
      totalBuyUSD += this.price * usdRate
    }
  }
  //#endregion
  // Update wallet assets
  await mongoose.models.Wallet.findOneAndUpdate(
    { _id: this.walletID },
    { assets, totalBuyUSD, totalSellUSD },
    { new: true }
  )
})

TransactionSchema.index({ walletID: 1, from: 1, to: 1, type: 1 })

export default mongoose.models.Transaction ||
  mongoose.model<TransactionDocument>('Transaction', TransactionSchema)
