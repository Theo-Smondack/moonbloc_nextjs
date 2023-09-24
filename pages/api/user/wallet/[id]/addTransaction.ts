import { NextApiRequest, NextApiResponse } from 'next';
import { createTransaction } from '../../../../../services/transactions';
import mongoose from 'mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }
    const query = req.query
    const body = req.body

    if (!query || !body) {
        return res.status(400).json({ ok: false, error: 'Invalid credentials' });
    }
    const { id } = query
    const { transaction } = body
    if (!id || !transaction) {
        return res.status(400).json({ ok: false, error: 'Invalid credentials' });
    }

    if (!isNaN(transaction.quantity) && !isNaN(transaction.price) && !isNaN(transaction.fee)) {
        transaction.quantity = parseFloat(transaction.quantity)
        transaction.price = parseFloat(transaction.price)
        transaction.fee = parseFloat(transaction.fee)
    }

    try {
        await createTransaction(transaction, id as string as unknown as mongoose.Types.ObjectId)
        return res.status(200).json({ ok: true, message: 'Transaction added successfully' });
    } catch (error) {
        return res.status(400).json({ ok: false, error: (error as Error).message });
    }
}