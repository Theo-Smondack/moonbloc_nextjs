import Wallet, {WalletClass, WalletDocument, WalletInput} from "../models/Wallet";
import mongoose, {FilterQuery, QueryOptions} from "mongoose";


export async function createWallet(input: WalletInput,userID:mongoose.Types.ObjectId): Promise<WalletDocument> {
    const wallet: WalletClass = new WalletClass(input.walletTitle, userID,[]);
    const walletExist = await Wallet.findOne({walletTitle:wallet.walletTitle,userID},'walletTitle',{lean:true})
    if (walletExist){
        throw new Error("Wallet already exist")
    }
    const userWallets = await findWallets({userID:userID}) as WalletDocument[]
    if ((userWallets).length >= 5){
        throw new Error("This user already has the maximum of wallets")
    }
    return Wallet.create(wallet)
}

export async function findWallets(query: FilterQuery<WalletDocument>, options: QueryOptions<WalletDocument> = {lean: true}) {
    if (!query.userID) throw new Error('userID is required');
    return Wallet.find(query, null, options);
}