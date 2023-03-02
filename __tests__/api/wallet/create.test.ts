import create from "../../../pages/api/user/wallet/create";
import {NextApiRequest, NextApiResponse} from "next";
import User, {UserDocument, UserInput} from "../../../models/User";
import DbConnection from "../../../utils/dbConnection";
import {createUser} from "../../../services/users";
import {createWallet} from "../../../services/wallet";
import Wallet from "../../../models/Wallet";

const userPayload: UserInput = {
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
    password: "johndpass123"
}

let user: UserDocument

let instance: DbConnection;

beforeAll(async () => {
    instance = await DbConnection.getInstance();
});

afterAll(async () => {
    await instance.closeConnection();
});


describe("Wallet create api", () => {
     beforeEach(async () => {
        user = await createUser(userPayload);

    });
     afterEach(async () => {
        await Wallet.deleteMany({});
        await User.deleteMany({});
    });
    describe("given input is valid",  () => {
         it("should create a new wallet", async () => {
            const req = {
                method: "POST",
                body: {
                    walletTitle: "John wallet",
                    userEmail: "john@example.com",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            }
            await create(req as NextApiRequest, res as unknown as NextApiResponse);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ok: true});
        });
    })
    describe("given input is not valid",  () => {
         it("should throw an Error : 'Method not allowed'", async () => {
            const req = {
                method: "GET",
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            };
            await create(req as NextApiRequest, res as unknown as NextApiResponse);
            expect(res.status).toHaveBeenCalledWith(405);
            expect(res.json).toHaveBeenCalledWith({ok: false, error: "Method not allowed"});
        });
         it('should throw an Error  : "Invalid credentials"', function () {
            const req = {
                method: "POST",
                body: {
                    walletTitle: "",
                    userEmail: "john@example.com",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            };
            create(req as NextApiRequest, res as unknown as NextApiResponse);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ok: false, error: "Invalid credentials"});
        });
         it('should throw an Error :"User does not exist"', async () => {
            const req = {
                method: "POST",
                body: {
                    walletTitle: "John wallet",
                    userEmail: "john1@mail.com",
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            }
            await create(req as NextApiRequest, res as unknown as NextApiResponse);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ok: false, error: "User does not exist"});
        });
         it('should throw an Error :"Wallet already exist"', async () => {
            await createWallet({walletTitle: "John wallet"}, user._id)
            const req = {
                method: "POST",
                body: {
                    walletTitle: "John wallet",
                    userEmail: "john@example.com",
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            }
            await create(req as NextApiRequest, res as unknown as NextApiResponse);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ok: false, error: "Wallet already exist"});
        });
         it('should throw an Error :"This user already has the maximum of wallets"', async () => {
            await createWallet({walletTitle: "wallet 1"}, user._id)
            await createWallet({walletTitle: "wallet 2"}, user._id)
            await createWallet({walletTitle: "wallet 3"}, user._id)
            await createWallet({walletTitle: "wallet 4"}, user._id)
            await createWallet({walletTitle: "wallet 5"}, user._id)
            const req = {
                method: "POST",
                body: {
                    walletTitle: "John wallet",
                    userEmail: "john@example.com",
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            }
            await create(req as NextApiRequest, res as unknown as NextApiResponse);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ok: false, error: "This user already has the maximum of wallets"});
        });
    })
});