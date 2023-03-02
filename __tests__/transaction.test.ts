import DbConnection from "../utils/dbConnection";
import {UserDocument, UserInput} from "../models/User";
import {WalletDocument, WalletInput} from "../models/Wallet";
import {createUser} from "../services/users";
import {createWallet} from "../services/wallet";
import Transaction, {TransactionInput} from "../models/Transaction";
import {createTransaction, findTransactions} from "../services/transactions";

let instance: DbConnection;
let user: UserDocument;
let wallet: WalletDocument;

const userPayload:UserInput = {
    email: "john@mail.com",
    firstName: "John",
    lastName: "Doe",
    password: "johndpass123"
}
const walletPayload:WalletInput = {
    walletTitle: "John wallet",
}

beforeAll(async () => {
    instance = await DbConnection.getInstance();
    user = await createUser(userPayload);
    wallet = await createWallet(walletPayload, user._id);
});

afterAll(async () => {
   await instance.closeConnection();
});

describe('Transaction model', () => {
    afterEach(async () => {
        await Transaction.deleteMany({});
    });

    const transactionPayload:TransactionInput = {
        date: new Date(), fee: 0.02, from: "usd", price: 150, quantity: 0.5, to: "ethereum", type: "buy"
    }


    describe('Create transaction', () => {
        describe('given input is valid', () => {
            it('should create a new transaction', async () => {
                const transaction = await createTransaction(transactionPayload, wallet._id);
                expect(transaction.date).toBe(transactionPayload.date);
                expect(transaction.fee).toBe(transactionPayload.fee);
                expect(transaction.from).toBe(transactionPayload.from);
                expect(transaction.price).toBe(transactionPayload.price);
                expect(transaction.quantity).toBe(transactionPayload.quantity);
                expect(transaction.to).toBe(transactionPayload.to);
                expect(transaction.type).toBe(transactionPayload.type);
                expect(transaction.walletID).toBe(wallet._id);
            });
        });
    });

    describe('Find transactions', () => {
        describe('given input is valid', () => {
            it('should find all transactions', async () => {
                await createTransaction(transactionPayload, wallet._id);
                await createTransaction({date: new Date(), fee: 0.02, from: "usd", price: 120, quantity: 1, to: "ethereum", type: "buy"}, wallet._id);
                await createTransaction({date: new Date(), fee: 0.02, from: "usd", price: 120, quantity: 1, to: "bitcoin", type: "buy"}, wallet._id);
                await createTransaction({date: new Date(), fee: 0.02, from: "ethereum", price: 250, quantity: 0.8, to: "usd", type: "sell"}, wallet._id);
                const transactions = await findTransactions({walletID:wallet._id});
                console.log(transactions)
                expect(transactions).toHaveLength(4);
            });

        });

    });

});