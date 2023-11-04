import Transaction, {
  TransactionClass,
  TransactionDocument,
  TransactionInput,
} from '../models/Transaction'
import mongoose, { FilterQuery, QueryOptions } from 'mongoose'

export async function createTransaction(
  input: TransactionInput,
  walletID: mongoose.Types.ObjectId
): Promise<TransactionDocument> {
  const transaction: TransactionClass = new TransactionClass(
    input.type,
    input.from,
    input.to,
    input.quantity,
    input.price,
    input.date,
    input.fee,
    walletID
  )
  return Transaction.create(transaction)
}

export async function findTransactions(
  query: FilterQuery<TransactionDocument>,
  options: QueryOptions<TransactionDocument> = { lean: true },
  fields: string | null = null
) {
  if (!query.walletID) throw new Error('walletID is required')
  return Transaction.find(query, fields, options)
}
