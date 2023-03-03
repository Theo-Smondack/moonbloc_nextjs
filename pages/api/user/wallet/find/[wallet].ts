import {NextApiRequest, NextApiResponse} from "next";
import {getWalletAssetsQuantity} from "../../../../../services/wallet";
import mongoose from "mongoose";
import {WalletResponse} from "../../../../../types/wallet";
import DbConnection from "../../../../../utils/dbConnection";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await DbConnection.getInstance()
    if (req.method !== 'GET') {
        res.status(405).json({
            ok: false,
            error: 'Method not allowed'
        })
        return
    }
    const {title,walletID} = req.query;
    try {
        const id = walletID as unknown as mongoose.Types.ObjectId
        console.log(id)
        const assets = await getWalletAssetsQuantity({walletID:id})
        const walletResponse : WalletResponse = {
            assets: assets,
            walletID: id,
            walletTitle: title as string
        }
        res.status(200).json({ok: true, wallet: walletResponse})
    }catch (error) {
        res.status(400).json({
            ok: false,
            error: (error as Error).message
        })
        return
    }
}