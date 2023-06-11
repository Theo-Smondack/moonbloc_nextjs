import User, {UserDocument, UserInput} from "../../../../models/User";
import Wallet, {WalletDocument, WalletInput} from "../../../../models/Wallet";
import DbConnection from "../../../../utils/dbConnection";
import {createWallet} from "../../../../services/wallet";
import {createUser} from "../../../../services/users";
import addTransaction from "../../../../pages/api/user/wallet/[id]/addTransaction";
import {NextApiRequest, NextApiResponse} from "next";
import {TransactionInput} from "../../../../models/Transaction";

const userPayload:UserInput = {
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
    password: "1234"
}

const walletPayload:WalletInput = {
    walletTitle: "John test wallet",
}

const transactionPayload:TransactionInput = {
    date: new Date(), fee: 0.02, from: "tether", price: 1250, quantity: 1, to: "ethereum", type: "buy"
}

let instance: DbConnection;

beforeAll(async () => {
    instance = await DbConnection.getInstance();
});

afterAll(async () => {
    await instance.closeConnection();
});

describe('Add transaction API', () => {
    let user: UserDocument;
    let wallet: WalletDocument;
    beforeEach(async () => {
        user = await createUser(userPayload);
        wallet = await createWallet(walletPayload, user._id);
    });
    afterEach(async () => {
        await User.deleteMany({});
        await Wallet.deleteMany({});
    });

    describe('given input is valid', () => {
        it('should create a new transaction', async () => {
            const req = {
                method: 'POST',
                body: {
                    transaction: transactionPayload
                },
                query: {
                    id: wallet._id
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }
            await addTransaction(req as unknown as NextApiRequest, res as unknown as NextApiResponse);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ok: true, message: "Transaction added successfully"});

        });
    });
    describe('given input is invalid', () => {
        it('should return an error : Method not allowed', async () => {
            const req = {
                method: 'GET'
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }
            await addTransaction(req as unknown as NextApiRequest, res as unknown as NextApiResponse);
            expect(res.status).toHaveBeenCalledWith(405);
            expect(res.json).toHaveBeenCalledWith({ok: false, error: 'Method not allowed'});
        });
        it('should return an error : Invalid credentials', async () => {
            const req = {
                method: 'POST',
                query: {
                    id: wallet._id
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }
            await addTransaction(req as unknown as NextApiRequest, res as unknown as NextApiResponse);
        });
    });

});