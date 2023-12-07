import mongoose, { Schema } from 'mongoose'

// Types imports
import { CryptoData } from '../types/cryptoData'
import { Asset } from '../types/wallet'
import { Currency } from '../types/currency'

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
  //#region Handle sell transaction
  if (this.type === 'sell') {
    const assetIndex = assets.findIndex(
      (asset: Asset) => asset.id === this.from.toLowerCase()
    )
    assets[assetIndex].quantity -= this.quantity
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
  }
  //#endregion
  // Update wallet assets
  await mongoose.models.Wallet.findOneAndUpdate(
    { _id: this.walletID },
    { assets },
    { new: true }
  )
})

TransactionSchema.index({ walletID: 1, from: 1, to: 1, type: 1 })

export default mongoose.models.Transaction ||
  mongoose.model<TransactionDocument>('Transaction', TransactionSchema)
