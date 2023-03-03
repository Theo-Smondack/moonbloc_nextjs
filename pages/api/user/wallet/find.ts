import {NextApiRequest, NextApiResponse} from "next";
import {isEmail} from "../../../../utils/toolFunctions";
import {findUser} from "../../../../services/users";
import {findWallets} from "../../../../services/wallet";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.status(405).json({
            ok: false,
            error: 'Method not allowed'
        })
        return
    }
    const {userEmail} = req.query;
    if (!userEmail || !isEmail(userEmail as string)) {
        res.status(400).json({
            ok: false,
            error: 'Invalid credentials'
        })
        return
    }
    try {
        const {_id} = await findUser({email: userEmail as string})
        try {
            const wallets = await findWallets({userID:_id})
            res.status(200).json({ok: true, wallets: wallets})
        } catch (error) {
            res.status(400).json({
                ok: false,
                error: (error as Error).message
            })
            return
        }

    }catch (error) {
        res.status(400).json({
            ok: false,
            error: (error as Error).message
        })
        return
    }


}