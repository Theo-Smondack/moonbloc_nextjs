import { getUserWatchlist } from '../../../services/users';
import { NextApiRequest, NextApiResponse } from 'next';
import DbConnection from '../../../helpers/dbConnection';
import { UserDocument } from '../../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await DbConnection.getInstance()
    const { method,query } = req
    const { email } = query
    if (method === 'GET') {
        try {
            const userEmail = email as UserDocument['email']
            const watchlist = await getUserWatchlist(userEmail)
            return res.status(200).json({ ok: true, watchlist: watchlist })
        } catch (error) {
            return res.status(422).json({ ok: false, error: (error as Error).message })
        }
    }
    return res.status(405).json({ ok:false })
}