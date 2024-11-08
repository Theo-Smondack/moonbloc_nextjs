import { NextApiRequest, NextApiResponse } from 'next';
import DbConnection from '../../../helpers/dbConnection';
import { createUser } from '../../../services/users';
import { UserInput } from '../../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await DbConnection.getInstance()
    const { method } = req
    if (method === 'POST') {
        try {
            const signUpData = req.body.data as UserInput
            const user = await createUser(signUpData)
            return res.status(201).json({ ok: true,user: user })
        } catch (error) {
            return res.status(422).json({ ok: false, error: (error as Error).message })
        }
    }
    return res.status(405).json({ ok:false })
}