import Wallet, {WalletClass, WalletDocument, WalletInput} from "../models/Wallet";
import mongoose, {FilterQuery, QueryOptions} from "mongoose";
import {TransactionDocument} from "../models/Transaction";
import {CryptoData} from "../types/cryptoData";
import {findTransactions} from "./transactions";
import {removeNullUndefined} from "../utils/toolFunctions";

export type WalletTransactionFilter = {
    walletID: mongoose.Types.ObjectId;
    assets?: CryptoData['id'][] | CryptoData['id'];
    date?: Date;
}
export type WalletTransactionFilterWithoutAssets = Omit<WalletTransactionFilter, 'assets'>;

export type walletAssets = {
    [key: CryptoData['id']]: TransactionDocument['quantity'];
}


export async function createWallet(input: WalletInput,userID:mongoose.Types.ObjectId): Promise<WalletDocument> {
    const wallet: WalletClass = new WalletClass(input.walletTitle, userID);
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

export async function getWalletTransactions(filter:WalletTransactionFilter,isEndDate?:boolean,fields?:string): Promise<TransactionDocument[]> {
    if (!filter.walletID) throw new Error('walletID is required');
    const parsedFilters = removeNullUndefined({
        walletID:filter.walletID,
        $or:filter.assets ? [{from:filter.assets},{to:filter.assets}] : undefined,
        date:filter.date ? isEndDate ? {$lt:filter.date} : {$gt:filter.date} : undefined,
    })
    const transactions = await findTransactions(parsedFilters,  {lean: false},fields);
    if (!transactions) {
        throw new Error("There are no transactions for your research");
    }
    return transactions
}

export async function getWalletAssetsQuantity(filter:WalletTransactionFilterWithoutAssets): Promise<walletAssets> {
    const transactions = await getWalletTransactions(filter,true, 'from to quantity type');
    if (transactions) {
        let assetsQuantity: walletAssets = {}
        transactions.map((transaction) => {
            if (transaction.type === 'buy') {
                if (assetsQuantity[transaction.to]) {
                    assetsQuantity[transaction.to] += transaction.quantity
                } else {
                    assetsQuantity[transaction.to] = transaction.quantity
                }
            } else {
                if (assetsQuantity[transaction.from]) {
                    assetsQuantity[transaction.from] = parseFloat((assetsQuantity[transaction.from] - transaction.quantity).toFixed(5))
                } else {
                    assetsQuantity[transaction.from] = transaction.quantity
                }
            }
        })
        return assetsQuantity
    }
    return {}
}