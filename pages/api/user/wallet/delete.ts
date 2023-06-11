import {NextApiRequest, NextApiResponse} from "next";
import {deleteWallet} from "../../../../services/wallet";
import DbConnection from "../../../../helpers/dbConnection";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await DbConnection.getInstance()
    if (req.method !== 'POST') {
        res.status(405).json({
            ok: false,
            error: 'Method not allowed'
        })
        return
    }
    const {walletID} = req.body;
    if (!walletID) {
        res.status(400).json({
            ok: false,
            error: 'Invalid credentials'
        })
        return
    }
    await deleteWallet(walletID).then(() => {
        res.status(200).json({ok: true})
    })
}