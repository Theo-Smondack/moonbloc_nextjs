import {NextApiRequest, NextApiResponse} from "next";
import {findUser} from "../../../../services/users";
import {isEmail} from "../../../../helpers/toolFunctions";
import {updateWallet} from "../../../../services/wallet";
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
    const {walletTitle,userEmail,walletID} = req.body;
    if (!walletTitle || !userEmail || !walletID || typeof walletTitle !== 'string' || !isEmail(userEmail)) {
        res.status(400).json({
            ok: false,
            error: 'Invalid credentials'
        })
        return
    }
    try {
        const {_id} = await findUser({email: userEmail})
        try {
            await updateWallet({walletID,walletTitle,userID:_id})
            res.status(200).json({ok: true, message: 'Wallet updated successfully'})
        } catch (error) {
            res.status(400).json({
                ok: false,
                error: (error as Error).message
            })
            return
        }
    } catch (error) {
        res.status(400).json({
            ok: false,
            error: (error as Error).message
        })
        return
    }
}