import handler from "../../../pages/api/user/wallet/delete";
import {NextApiRequest, NextApiResponse} from "next";
import User, {UserDocument, UserInput} from "../../../models/User";
import DbConnection from "../../../helpers/dbConnection";
import {createUser} from "../../../services/users";
import {createWallet} from "../../../services/wallet";
import Wallet, {WalletDocument} from "../../../models/Wallet";

const userPayload: UserInput = {
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
    password: "johndpass123"
}

let user: UserDocument
let wallet: WalletDocument

let instance: DbConnection;

beforeAll(async () => {
    instance = await DbConnection.getInstance();
});

afterAll(async () => {
    await instance.closeConnection();
});


describe("Wallet delete api", () => {
    beforeEach(async () => {
        user = await createUser(userPayload);
        wallet = await createWallet({walletTitle: "John wallet"}, user._id);
    });
    afterEach(async () => {
        await Wallet.deleteMany({});
        await User.deleteMany({});
    });
    describe("given input is valid",  () => {
        it("should delete the wallet", async () => {
            const req = {
                method: "POST",
                body: {
                    walletID: wallet._id,
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            }
            await handler(req as NextApiRequest, res as unknown as NextApiResponse);
            const deleteWallet = await Wallet.findById(wallet._id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ok: true});
            expect(deleteWallet).toBeNull();
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
            await handler(req as NextApiRequest, res as unknown as NextApiResponse);

            expect(res.status).toHaveBeenCalledWith(405);
            expect(res.json).toHaveBeenCalledWith({ok: false, error: "Method not allowed"});

        });
        it('should throw an Error  : "Invalid credentials"', async () => {
            const req = {
                method: "POST",
                body: {},
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            };
            await handler(req as NextApiRequest, res as unknown as NextApiResponse);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ok: false, error: "Invalid credentials"});
        });
    })
});