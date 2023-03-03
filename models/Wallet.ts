
import mongoose, {model, models, Schema} from "mongoose";

export interface WalletInput {
    walletTitle: string;
}

export class WalletClass implements WalletInput {
    public walletTitle: string;
    public userID: mongoose.Types.ObjectId;

    constructor(walletTitle: string, userID: mongoose.Types.ObjectId) {
        this.walletTitle = walletTitle;
        this.userID = userID;
    }
}

export interface WalletDocument extends WalletClass, Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const WalletSchema: Schema = new Schema({
        walletTitle: {type: String, required: true},
        userID: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    }, {
        timestamps: true
    }
);

export default models.Wallet || model<WalletDocument>('Wallet', WalletSchema);