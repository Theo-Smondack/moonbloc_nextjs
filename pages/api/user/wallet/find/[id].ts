import {NextApiRequest, NextApiResponse} from "next";
import {getWalletAssets} from "../../../../../services/wallet";
import mongoose from "mongoose";
import {Asset, WalletResponse} from "../../../../../types/wallet";
import DbConnection from "../../../../../helpers/dbConnection";
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
    const {id, currency} = req.query;
    try {
        const _id = id as unknown as mongoose.Types.ObjectId
        const {walletTitle} = await Wallet.findOne({_id: id}, 'walletTitle', {lean: true})
        const assets = await getWalletAssets({walletID: _id})
        if (assets.length) {
            const assetsIds = assets.map(asset => asset.id).join(',')
            await fetch(`https://api.coingecko.com/api/v3/coins/markets?ids=${assetsIds}&vs_currency=${currency}`).then(async (response) => {
                const result = await response.json();
                result.map((elem: any) => {
                    const updateAsset = assets.find((asset) => asset.id === elem.id) as Asset
                    updateAsset.total = elem.current_price * updateAsset.quantity
                    updateAsset.image = elem.image
                    updateAsset.price = elem.current_price
                    updateAsset.symbol = elem.symbol
                    updateAsset.name = elem.name

                })
            }, (err) => res.status(400).json({ok: false, error: (err as Error).message}))
            assets.sort((a,b) => b.total - a.total)

        }

        const wallet: WalletResponse['wallet'] = {
            assets: assets,
            walletID: _id,
            walletTitle: walletTitle
        }
        res.status(200).json({ok: true, wallet: wallet})
    } catch (error) {
        res.status(400).json({
            ok: false,
            error: (error as Error).message
        })
        return
    }
}