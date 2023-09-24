import { WalletDocument } from '../models/Wallet';
import mongoose from 'mongoose';
import { CryptoData } from './cryptoData';


export type Asset = {
    symbol: string,
    name: string,
    id: string,
    image: string
    price: number;
    quantity: number;
    total: number;
}

export type AssetApiResponse = Omit<Asset, 'total' | 'quantity'>;
export type AssetApiResponseList = AssetApiResponse[];

export type AssetList = Asset[];

export type WalletResponse = {
    ok : boolean;
    wallet:{
        walletTitle: WalletDocument['walletTitle'];
        walletID: WalletDocument['_id'] | string;
        assets: AssetList;
    }

}

export type WalletTransactionFilter = {
    walletID: mongoose.Types.ObjectId;
    assets?: CryptoData['id'][] | CryptoData['id'];
    date?: Date;
}
export type WalletTransactionFilterWithoutAssets = Omit<WalletTransactionFilter, 'assets'>;

export type WalletsState = WalletDocument[];

export type WalletsContextType = {
    wallets:WalletsState;
    setWallets: (state:WalletsState) => void;

}

export type WalletModalState = {
    show: boolean;
    type: 'create' | 'edit';
    walletID?: string;
}

export type WalletModalContextType = {
    state: WalletModalState;
    setState: (state: WalletModalState) => void;
}