import mongoose, { model, models, Query, Schema } from 'mongoose'

// Models imports
import Transaction from './Transaction'

// Types imports
import { AssetList } from '../types/wallet'

export interface WalletInput {
  walletTitle: string
  assets?: AssetList
}

export class WalletClass implements WalletInput {
  public walletTitle: string
  public userID: mongoose.Types.ObjectId
  public assets?: AssetList

  constructor(
    walletTitle: string,
    userID: mongoose.Types.ObjectId,
    assets?: AssetList
  ) {
    this.walletTitle = walletTitle
    this.userID = userID
    this.assets = assets
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
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: false,
    },
  }
)

WalletSchema.methods.getAssets = function (): AssetList {
  return this.assets
}

WalletSchema.methods.getWalletTitle = function (): WalletInput['walletTitle'] {
  return this.walletTitle
}

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
