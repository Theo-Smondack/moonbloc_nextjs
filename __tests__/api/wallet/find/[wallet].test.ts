import DbConnection from "../../../../utils/dbConnection";
import User, {UserInput} from "../../../../models/User";
import Wallet, {WalletDocument, WalletInput} from "../../../../models/Wallet";
import {createUser} from "../../../../services/users";
import {createWallet} from "../../../../services/wallet";
import Transaction from "../../../../models/Transaction";
import {createTransaction} from "../../../../services/transactions";
import handler from "../../../../pages/api/user/wallet/find/[id]";
import {NextApiRequest, NextApiResponse} from "next";

let instance:DbConnection;

beforeAll(async () =>{
    instance = await DbConnection.getInstance()
});

afterAll(async () => {
    await instance.closeConnection()
});

describe('Get wallet details', () => {
    const userPayload : UserInput={
        email: "john@example.com",
        firstName: "John",
        lastName: "Doe",
        password: "pass1234"
    }

    const walletPayload1:WalletInput = {
        walletTitle:"Wallet 1"
    }


    async function addTransactions(wallet:WalletDocument){
        await createTransaction({date: new Date(2022,2,12,1,35,5), fee: 0.02, from: "usd", price: 120, quantity: 1, to: "ethereum", type: "buy"}, wallet._id);
        await createTransaction({date: new Date(2023,0,25,13,14,46), fee: 0.02, from: "usd", price: 120, quantity: 1, to: "bitcoin", type: "buy"}, wallet._id);
        await createTransaction({date: new Date(2023,1,20,10,54,18), fee: 0.02, from: "ethereum", price: 250, quantity: 0.745, to: "usd", type: "sell"}, wallet._id);
        await createTransaction({date: new Date(2023,1,20,10,54,18), fee: 0.02, from: "usd", price: 250, quantity: 0.0013567, to: "bitcoin", type: "buy"}, wallet._id);
    }

    let wallet:WalletDocument;

    beforeEach(async () => {
        const user = await createUser(userPayload);
        wallet = await createWallet(walletPayload1,user._id)
        await addTransactions(wallet);
    });

    afterEach(async () => {
        await User.deleteMany({});
        await Wallet.deleteMany({});
        await Transaction.deleteMany({});
    });

    describe('given input is valid', () => {
        it('should return all wallet details',async () => {
            const req = {
                method: 'GET',
                query: {
                    id: wallet._id
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }
            await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ok: true, wallet: expect.any(Object)});
        })
    })

})
