import Wallet, {WalletClass, WalletDocument, WalletInput} from "../models/Wallet";
import mongoose, {FilterQuery, QueryOptions} from "mongoose";
import {TransactionDocument} from "../models/Transaction";
import {findTransactions} from "./transactions";
import {removeNullUndefined} from "../helpers/toolFunctions";
import {WalletTransactionFilter, WalletTransactionFilterWithoutAssets, AssetList} from "../types/wallet";

export async function createWallet(input: WalletInput, userID: mongoose.Types.ObjectId): Promise<WalletDocument> {
    const wallet: WalletClass = new WalletClass(input.walletTitle, userID);
    const walletExist = await Wallet.findOne({walletTitle: wallet.walletTitle, userID}, 'walletTitle', {lean: true})
    if (walletExist) {
        throw new Error("Wallet already exist")
    }
    const userWallets = await findWallets({userID: userID}) as WalletDocument[]
    if ((userWallets).length >= 5) {
        throw new Error("This user already has the maximum of wallets")
    }
    return Wallet.create(wallet)
}

export async function findWallets(query: FilterQuery<WalletDocument>, options: QueryOptions<WalletDocument> = {lean: true}) {
    if (!query.userID) throw new Error('userID is required');
    return Wallet.find(query, null, options);
}

export async function updateWallet({
                                       walletID,
                                       walletTitle,
                                       userID
                                   }: { walletID: mongoose.Types.ObjectId, walletTitle: string, userID: mongoose.Types.ObjectId }) {
    const walletExist = await Wallet.findOne({walletTitle: walletTitle, userID}, 'walletTitle', {lean: true})
    if (!walletExist) return Wallet.findOneAndUpdate({_id: walletID}, {walletTitle: walletTitle}, {new: true})
}

export async function deleteWallet(walletID: mongoose.Types.ObjectId) {
    const wallet = await Wallet.findOne({_id: walletID}, null, {lean: true})
    if (wallet) await Wallet.deleteOne({_id: walletID})
}

export async function getWalletTransactions(filter: WalletTransactionFilter, isEndDate?: boolean, fields?: string): Promise<TransactionDocument[]> {
    if (!filter.walletID) throw new Error('walletID is required');
    const parsedFilters = removeNullUndefined({
        walletID: filter.walletID,
        $or: filter.assets ? [{from: filter.assets}, {to: filter.assets}] : undefined,
        date: filter.date ? isEndDate ? {$lt: filter.date} : {$gt: filter.date} : undefined,
    })
    const transactions = await findTransactions(parsedFilters, {lean: false}, fields);
    if (!transactions) {
        throw new Error("There are no transactions for your research");
    }
    return transactions
}

export async function getWalletAssets(filter: WalletTransactionFilterWithoutAssets): Promise<AssetList> {
    const transactions = await getWalletTransactions(filter, true, 'from to quantity type');
    const assets: AssetList = []
    if (transactions) {
        transactions.forEach((transaction) => {
            if (transaction.type === 'buy') {
                const asset = assets.find((asset) => asset.id === transaction.to);
                if (asset) {
                    asset.quantity += transaction.quantity
                } else {
                    assets.push({
                        symbol: '',
                        name: '',
                        id: transaction.to,
                        image: '',
                        price: 0,
                        quantity: transaction.quantity,
                        total: 0
                    })
                }
            } else {
                const asset = assets.find((asset) => asset.id === transaction.from);
                if (asset) {
                    asset.quantity = parseFloat((asset.quantity - transaction.quantity).toFixed(5))
                } else {
                    assets.push({
                        symbol: '',
                        name: '',
                        id: transaction.from,
                        image: '',
                        price: 0,
                        quantity: transaction.quantity,
                        total: 0
                    })
                }
            }
        })
    }
    return assets
}



