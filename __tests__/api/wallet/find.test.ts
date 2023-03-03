import DbConnection from "../../../utils/dbConnection";
import User, {UserInput} from "../../../models/User";
import Wallet, {WalletInput} from "../../../models/Wallet";
import {createUser} from "../../../services/users";
import {createWallet} from "../../../services/wallet";
import find from "../../../pages/api/user/wallet/find";
import {NextApiRequest, NextApiResponse} from "next";

let instance:DbConnection;

beforeAll(async () =>{
    instance = await DbConnection.getInstance()
});

afterAll(async () => {
    await instance.closeConnection()
});

describe('Find all user wallets',() => {
    const userPayload : UserInput={
        email: "john@example.com",
        firstName: "John",
        lastName: "Doe",
        password: "pass1234"
    }

    const walletPayload1:WalletInput = {
        walletTitle:"Wallet 1"
    }
    const walletPayload2:WalletInput = {
        walletTitle:"Wallet 2"
    }

    beforeEach(async () => {
        const user = await createUser(userPayload);
        await createWallet(walletPayload1,user._id)
        await createWallet(walletPayload2,user._id)
    });

    afterEach(async () => {
        await User.deleteMany({});
        await Wallet.deleteMany({});
    });

    describe('given input is valid',() => {
       it('should return all user wallets', async () => {
           const req = {
               method: "GET",
               query: {
                   userEmail: "john@example.com",
                },
              };
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn().mockReturnThis(),
                }
                await find(req as unknown as NextApiRequest, res as unknown as NextApiResponse);
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({ok: true, wallets: expect.any(Array)});

       });
    });

    describe('given input is not valid',() => {
        it('should throw an error: "Method not allowed"', async () => {
            const req = {
                method: "POST",
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            }
            await find(req as NextApiRequest, res as unknown as NextApiResponse);
            expect(res.status).toHaveBeenCalledWith(405);
            expect(res.json).toHaveBeenCalledWith({ok: false, error: "Method not allowed"});
        });
        it('should throw an Error  : "Invalid credentials"', async () => {
            const req = {
                method: "GET",
                query: {
                    userEmail: "john",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            };
            await find(req as unknown as NextApiRequest, res as unknown as NextApiResponse);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ok: false, error: "Invalid credentials"});
        });
    })
})