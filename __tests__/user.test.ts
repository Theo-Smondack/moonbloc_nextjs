import {createUser, findUser, getUserWallets, loginUser, updateUser} from "../services/users";
import User, {UserInput} from "../models/User";
import {createWallet} from "../services/wallet";
import DbConnection from "../utils/dbConnection";
import Wallet from "../models/Wallet";
import Transaction from "../models/Transaction";

let instance: DbConnection;
beforeAll(async () => {
    instance = await DbConnection.getInstance();
});

afterAll(async () => {
    await instance.closeConnection();
});

describe("User model", () => {
    afterEach(async () => {
        await User.deleteMany({});
        await Wallet.deleteMany({});
        await Transaction.deleteMany({});
    });

    const userPayload: UserInput = {
        email: "john@example.com",
        firstName: "John",
        lastName: "Doe",
        password: "johndpass123"
    }

    describe('Create user', () => {
        describe('given input is valid', () => {
            it('should create a new user', async () => {
                const user = await createUser(userPayload);
                expect(user.password).toHaveLength(60);
                expect(user.firstName).toBe(userPayload.firstName);
                expect(user.lastName).toBe(userPayload.lastName);
                expect(user.email).toBe(userPayload.email);
                expect(user.watchlist).toBeDefined();
            });
        });
        describe('given input is not valid', () => {
            it('should throw an Error: "User already exist"', async function () {
                await createUser(userPayload);
                const newUser = createUser(userPayload);
                await expect(newUser).rejects.toThrow(new Error('User already exist'))
            });
        })
    });

    describe('Login user', () => {
        describe('given the password is correct', () => {
            it('should return true', async () => {
                const newUser = await createUser(userPayload);
                const user = await loginUser({email: newUser.email, password: userPayload.password});
                expect(user.firstName).toBe(userPayload.firstName);
                expect(user.lastName).toBe(userPayload.lastName);
                expect(user.email).toBe(userPayload.email);
                expect(user.watchlist).toBeDefined();
            });
        });
        describe('given email does not exist', () => {
            it('should throw an Error: User does not exist', async () => {
                await createUser(userPayload);
                const action = async () => {
                    await loginUser({
                        email: "wrong@mail.com",
                        password: "wrong"
                    });
                }
                await expect(action()).rejects.toThrow(new Error("User does not exist"));

            });
        });

        describe('given the password is wrong', () => {
            it('should throw an Error: Invalid password', async () => {
                const newUser = await createUser(userPayload);
                const action = async () => {
                    await loginUser({
                        email: newUser.email,
                        password: 'wrong'
                    });
                }
                await expect(action()).rejects.toThrow(new Error("Invalid password"));

            });
        });
    });

    describe('Full name virtual property', () => {
        it('should return the user full name', async () => {
            await createUser(userPayload);
            const user = await findUser({email: userPayload.email}, {lean: false});
            expect(user?.fullName).toBe(
                `${userPayload.firstName} ${userPayload.lastName}`
            );

        });
    })

    describe('Update user', () => {
        describe('given input is valid', () => {
            it('should update the user', async () => {
                const newUser = await createUser(userPayload);
                const update = {
                    firstName: "Jack",
                    watchlist: ['bitcoin', 'ethereum']
                }
                const user = await updateUser(newUser.email, update);
                expect(user?.firstName).toBe(update.firstName);
                expect(user?.watchlist).toStrictEqual(update.watchlist);
            });
        });
        describe('given input is wrong', () => {
            it('should not add the user new prop : myProps', async () => {
                const newUser = await createUser(userPayload);
                const update = {
                    firstName: "John",
                    myProps: 'bitcoin',
                }
                const user = await updateUser(newUser.email, update);
                expect(user?.myProps).toBeUndefined();
            });
        });
    });

    describe('Get user wallets', () => {
        it('should return the user wallets', async () => {
            const newUser = await createUser(userPayload);
            await createWallet({walletTitle: "wallet1"}, newUser._id);
            const wallets = await getUserWallets(newUser.email);
            expect(wallets).toHaveLength(1);
        });
    });
});