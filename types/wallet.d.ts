import {WalletDocument} from "../models/Wallet";
import {walletAssets} from "../services/wallet";

export type WalletResponse = {
    walletTitle: WalletDocument['walletTitle'];
    walletID: WalletDocument['_id'];
    assets: walletAssets;
}

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