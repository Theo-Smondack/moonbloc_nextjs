// Models imports
import { WalletDocument } from '../models/Wallet'

export type Asset = {
  symbol: string
  name: string
  id: string
  image: string
  price: number
  quantity: number
  total: number
}
export type CGAsset = {
  id: string
  symbol: string
  current_price: number
  image: string
  name: string
}
export type AssetList = Asset[]

export type WalletResponse = {
  ok: boolean
  wallet: {
    walletTitle: WalletDocument['walletTitle']
    walletID: WalletDocument['_id'] | string
    assets: AssetList
  }
}
export type WalletsState = WalletDocument[]

export type WalletsContextType = {
  wallets: WalletsState
  setWallets: (state: WalletsState) => void
}

export type WalletModalState = {
  show: boolean
  type: 'create' | 'edit'
  walletID?: string
}

export type WalletModalContextType = {
  state: WalletModalState
  setState: (state: WalletModalState) => void
}
