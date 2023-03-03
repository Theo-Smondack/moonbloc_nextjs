import {WalletDocument} from "../models/Wallet";
import {walletAssets} from "../services/wallet";

export type WalletResponse = {
    walletTitle: WalletDocument['walletTitle'];
    walletID: WalletDocument['_id'];
    assets: walletAssets;
}