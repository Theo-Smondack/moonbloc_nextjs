import mongoose, { Schema } from 'mongoose'

// Types imports
import { CryptoData } from '../types/cryptoData'
import { Asset } from '../types/wallet'
import { Currency } from '../types/currency'
import { getUSDRate, isFiat } from '../helpers/currencies'
import { isToday } from '../helpers/toolFunctions'

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
    const isFiatTransaction = isFiat(this.to)
    let totalNetUSDprofits =
      assetIndex === -1 ? 0 : assets[assetIndex].totalNetUSDprofits ?? 0
    const quantityWithFee = this.quantity + this.fee
    let usdRate: number

    // Compute USD rate
    if (isToday(this.date)) {
      usdRate = parseFloat(await getUSDRate(this.to))
    } else {
      usdRate = parseFloat(await getUSDRate(this.to, this.date))
    }
    totalSellUSD = isFiatTransaction ? quantityWithFee * usdRate : totalSellUSD
    totalNetUSDprofits += quantityWithFee * usdRate

    // Update asset
    assets[assetIndex].quantity -= this.price
    assets[assetIndex].totalNetUSDprofits = totalNetUSDprofits
  }
  //#endregion
  //#region Handle buy transaction
  else if (this.type === 'buy') {
    const assetIndex = assets.findIndex(
      (asset: Asset) => asset.id === this.to.toLowerCase()
    )
    const isFiatTransaction = isFiat(this.from)
    let totalNetUSDprofits =
      assetIndex === -1 ? 0 : assets[assetIndex].totalNetUSDprofits ?? 0
    const priceWithFee = this.price + this.fee
    let usdRate: number

    // Compute USD rate
    if (isToday(this.date)) {
      usdRate = parseFloat(await getUSDRate(this.from))
    } else {
      usdRate = parseFloat(await getUSDRate(this.from, this.date))
    }
    totalBuyUSD = isFiatTransaction
      ? totalBuyUSD + priceWithFee * usdRate
      : totalBuyUSD
    totalNetUSDprofits -= priceWithFee * usdRate

    // Update asset
    if (assetIndex === -1) {
      assets.push({
        id: this.to.toLowerCase(),
        quantity: this.quantity,
        totalNetUSDprofits: totalNetUSDprofits,
      })
    } else {
      assets[assetIndex].quantity += this.quantity
      assets[assetIndex].totalNetUSDprofits = totalNetUSDprofits
    }
  }
  //#endregion
  //#region Handle swap transaction
  else if (this.type === 'swap') {
    const fromAssetIndex = assets.findIndex(
      (asset: Asset) => asset.id === this.from.toLowerCase()
    )
    if (fromAssetIndex === -1) throw new Error('Cannot swap non-existing asset')
    const toAssetIndex = assets.findIndex(
      (asset: Asset) => asset.id === this.to.toLowerCase()
    )
    const isFiatFrom = isFiat(this.from)
    const isFiatTo = isFiat(this.to)
    if (isFiatFrom || isFiatTo) throw new Error('Cannot swap fiat currencies')
    let fromTotalNetUSDprofit = assets[fromAssetIndex].totalNetUSDprofits ?? 0
    let toTotalNetUSDprofit =
      toAssetIndex === -1 ? 0 : assets[toAssetIndex].totalNetUSDprofits ?? 0
    let toUSDRate: number
    let fromUSDRate: number

    // Compute USD rate
    if (isToday(this.date)) {
      fromUSDRate = parseFloat(await getUSDRate(this.from))
      toUSDRate = parseFloat(await getUSDRate(this.to))
    } else {
      fromUSDRate = parseFloat(await getUSDRate(this.from, this.date))
      toUSDRate = parseFloat(await getUSDRate(this.to, this.date))
    }
    fromTotalNetUSDprofit += this.price * fromUSDRate
    toTotalNetUSDprofit -= this.quantity * toUSDRate

    // Update from asset
    assets[fromAssetIndex].quantity -= this.price
    assets[fromAssetIndex].totalNetUSDprofits = fromTotalNetUSDprofit

    // Update to asset
    if (toAssetIndex === -1) {
      assets.push({
        id: this.to.toLowerCase(),
        quantity: this.quantity,
        totalNetUSDprofits: toTotalNetUSDprofit,
      })
    } else {
      assets[toAssetIndex].quantity += this.quantity
      assets[toAssetIndex].totalNetUSDprofits = toTotalNetUSDprofit
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
