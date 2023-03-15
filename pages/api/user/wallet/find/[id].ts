import {NextApiRequest, NextApiResponse} from "next";
import {getWalletAssetsQuantity} from "../../../../../services/wallet";
import mongoose from "mongoose";
import {WalletResponse} from "../../../../../types/wallet";
import DbConnection from "../../../../../utils/dbConnection";
import Wallet from "../../../../../models/Wallet";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await DbConnection.getInstance()
    if (req.method !== 'GET') {
        res.status(405).json({
            ok: false,
            error: 'Method not allowed'
        })
        return
    }
    const {id} = req.query;
    try {
        const _id = id as unknown as mongoose.Types.ObjectId
        const {walletTitle} = await Wallet.findOne({_id:id},'walletTitle',{lean:true})
        const assets = await getWalletAssetsQuantity({walletID:_id})
        const wallet : WalletResponse['wallet'] = {
            assets: assets,
            walletID: _id,
            walletTitle: walletTitle
        }
        res.status(200).json({ok: true, wallet: wallet})
    }catch (error) {
        res.status(400).json({
            ok: false,
            error: (error as Error).message
        })
        return
    }
}