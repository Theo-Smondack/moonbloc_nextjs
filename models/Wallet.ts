import {CryptoData} from "../types/cryptoData";
import mongoose, {model, Schema} from "mongoose";

export interface WalletInput {
    walletTitle: string;
}

export class WalletClass implements WalletInput {
    public walletTitle: string;
    public userID: mongoose.Types.ObjectId;
    public assets: CryptoData['id'][] = [];

    constructor(walletTitle: string, userID: mongoose.Types.ObjectId, assets: CryptoData['id'][]) {
        this.walletTitle = walletTitle;
        this.userID = userID;
        this.assets = assets;
    }
}

export interface WalletDocument extends WalletClass, Document {
    createdAt: Date;
    updatedAt: Date;
}

const WalletSchema: Schema = new Schema({
        walletTitle: {type: String, required: true},
        userID: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
        assets: [{type: String, required: true}]
    }, {
        timestamps: true
    }
);

export default model<WalletDocument>('Wallet', WalletSchema);