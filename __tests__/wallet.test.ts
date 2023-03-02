import User, {UserDocument, UserInput} from "../models/User";
import Wallet, {WalletDocument, WalletInput} from "../models/Wallet";
import {createUser} from "../services/users";
import {createWallet, findWallets, getWalletAssetsQuantity, getWalletTransactions} from "../services/wallet";
import DbConnection from "../utils/dbConnection";
import {createTransaction} from "../services/transactions";
import Transaction from "../models/Transaction";

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
    await Wallet.deleteMany({});
    await User.deleteMany({});
});

afterAll(async () => {
    await instance.closeConnection();
});

describe('Wallet model', () => {
    beforeEach(async () => {
        user = await createUser(userPayload);
    });

    afterEach(async () => {
        await User.deleteMany({});
        await Wallet.deleteMany({});
        await Transaction.deleteMany({});
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

    async function addTransactions(wallet:WalletDocument){
        await createTransaction({date: new Date(2022,2,12,1,35,5), fee: 0.02, from: "usd", price: 120, quantity: 1, to: "ethereum", type: "buy"}, wallet._id);
        await createTransaction({date: new Date(2023,0,25,13,14,46), fee: 0.02, from: "usd", price: 120, quantity: 1, to: "bitcoin", type: "buy"}, wallet._id);
        await createTransaction({date: new Date(2023,1,20,10,54,18), fee: 0.02, from: "ethereum", price: 250, quantity: 0.745, to: "usd", type: "sell"}, wallet._id);
        await createTransaction({date: new Date(2023,1,20,10,54,18), fee: 0.02, from: "usd", price: 250, quantity: 0.0013567, to: "bitcoin", type: "buy"}, wallet._id);
    }

    describe('Find transactions', () => {
        let wallet: WalletDocument;
        beforeEach(async () => {
            wallet = await createWallet(walletPayload, user._id);
            await addTransactions(wallet);
          });

        afterEach(async () => {
            await Transaction.deleteMany({});
        })
        describe('given input is valid', () => {
            it('should return a array of transaction with a length of 4', async () => {
                const transactions = await getWalletTransactions({walletID:wallet._id});
                expect(transactions).toHaveLength(4)
            });
            it('should return a array of transaction with a length of 2', async () => {
                const transactions = await getWalletTransactions({walletID:wallet._id, assets:"ethereum"});
                expect(transactions).toHaveLength(2)
            });
            it('should return a array of transaction with a length of 1', async () => {
                const transactions = await getWalletTransactions({walletID:wallet._id, date:new Date(2023,0,26)},false);
                expect(transactions).toHaveLength(2)
            });

        });

    });

    describe('Get wallet assets quantity', () => {
        it('should return an object with bitcoin value to 1.0013567 and ethereum to 0.255', async () => {
            const wallet = await createWallet(walletPayload, user._id);
            await addTransactions(wallet);
            const assetsQuantity = await getWalletAssetsQuantity({walletID:wallet._id});
            expect(assetsQuantity).toEqual({bitcoin:1.0013567,ethereum:0.255})
        });
        it('should return an object with bitcoin value to 1 and ethereum to 1', async () => {
            const wallet = await createWallet(walletPayload, user._id);
            await addTransactions(wallet);
            const assetsQuantity = await getWalletAssetsQuantity({walletID:wallet._id, date:new Date(2023,0,26)});
            expect(assetsQuantity).toEqual({bitcoin:1,ethereum:1})
        });

    });

});