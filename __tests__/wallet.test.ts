import User, {UserDocument, UserInput} from "../models/User";
import Wallet, {WalletInput} from "../models/Wallet";
import {createUser} from "../services/users";
import {createWallet, findWallets} from "../services/wallet";
import DbConnection from "../utils/dbConnection";

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
    user = await createUser(userPayload);
});

afterAll(async () => {
    await User.deleteMany({});
    await instance.closeConnection();
});

describe('Wallet model', () => {
    afterEach(async () => {
        await Wallet.deleteMany({});
    });

    const walletPayload: WalletInput = {
        walletTitle: "John wallet",
    }

    describe('Create wallet', () => {
        describe('given input is valid', () => {
            it('should create a new wallet', async () => {
                const wallet = await createWallet(walletPayload, user._id);
                expect(wallet.walletTitle).toBe(walletPayload.walletTitle);
                expect(wallet.userID).toBe(user._id);
                expect(wallet.assets).toBeDefined();
            });
        })
        describe('given input is not valid', () => {
            it('should throw an Error: "Wallet already exist"', async () => {
                await createWallet(walletPayload, user._id);
                const newWallet = createWallet(walletPayload, user._id);
                await expect(newWallet).rejects.toThrow(new Error('Wallet already exist'))
            });
            it('should throw an Error: "This user already has the maximum of wallets"', async () => {
                await createWallet(walletPayload, user._id);
                await createWallet({walletTitle:"Wallet 2"}, user._id);
                await createWallet({walletTitle:"Wallet 3"}, user._id);
                await createWallet({walletTitle:"Wallet 4"}, user._id);
                await createWallet({walletTitle:"Wallet 5"}, user._id);
                const newWallet = createWallet({walletTitle:"Wallet 6"}, user._id);
                await expect(newWallet).rejects.toThrow(new Error('This user already has the maximum of wallets'))
            });
        })
    })
    describe('Find wallets', () => {
        describe('given input is valid', () => {
            it('should return an array of wallets', async () => {
                await createWallet(walletPayload, user._id);
                await createWallet({walletTitle:"Wallet 2"}, user._id);
                await createWallet({walletTitle:"Wallet 3"}, user._id);
                const wallets = await findWallets({userID: user._id})
                expect(wallets).toHaveLength(3)
            });

        })

    })

});