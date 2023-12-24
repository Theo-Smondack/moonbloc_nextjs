import mongoose, { model, models, Query, Schema } from 'mongoose'

// Helpers imports
import { getUSDRate } from '../helpers/currencies'

// Models imports
import Transaction from './Transaction'

// Types imports
import { AssetList } from '../types/wallet'

export interface WalletInput {
  walletTitle: string
  assets?: AssetList
  totalBuyUSD?: number
  totalSellUSD?: number
}

export class WalletClass implements WalletInput {
  public walletTitle: string
  public userID: mongoose.Types.ObjectId
  public assets?: AssetList
  public totalBuyUSD?: number
  public totalSellUSD?: number

  constructor(
    walletTitle: string,
    userID: mongoose.Types.ObjectId,
    assets?: AssetList,
    totalBuyUSD?: number,
    totalSellUSD?: number
  ) {
    this.walletTitle = walletTitle
    this.userID = userID
    this.assets = assets
    this.totalBuyUSD = totalBuyUSD
    this.totalSellUSD = totalSellUSD
  }
}

export interface WalletDocument extends WalletClass, Document {
  _id: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const WalletSchema: Schema = new Schema<WalletDocument>(
  {
    walletTitle: { type: String, required: true },
    userID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assets: [{ type: Object }],
    totalBuyUSD: { type: Number },
    totalSellUSD: { type: Number },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: false,
    },
  }
)

//#region Methods
WalletSchema.methods.getAssets = function (): AssetList {
  return this.assets
}

WalletSchema.methods.getWalletTitle = function (): WalletInput['walletTitle'] {
  return this.walletTitle
}

WalletSchema.methods.getTotalInvested = async function (
  currency: string
): Promise<number> {
  const usdRate: number = parseFloat(await getUSDRate(currency))
  if (usdRate === 1) return this.totalBuyUSD
  return this.totalBuyUSD * usdRate
}

WalletSchema.methods.getWalletProfit = async function (
  currency: string
): Promise<number> {
  const usdRate: number = parseFloat(await getUSDRate(currency))
  if (usdRate === 1) return this.totalSellUSD - this.totalBuyUSD
  return (this.totalSellUSD - this.totalBuyUSD) * usdRate
}
//#endregion

//#region Middlewares
WalletSchema.pre(
  'deleteOne',
  { document: false, query: true },
  async function (this: Query<unknown, WalletDocument>, next) {
    try {
      const walletID = this.getFilter()._id as mongoose.Types.ObjectId
      await Transaction.deleteMany({ walletID })
      next()
    } catch (error) {
      next(error as Error)
    }
  }
)
//#endregion

export default models.Wallet || model<WalletDocument>('Wallet', WalletSchema)
