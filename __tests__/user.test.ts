import {createUser, findUser, loginUser} from "../services/users";
import User, {Gender, UserInput} from "../models/User";
import mongoose from "mongoose";
import DbConnection from "../utils/dbConnection";

beforeAll(async () => {
    console.log('Before all')
    await DbConnection.getInstance()
});

afterAll(async () => {
    console.log('After all')
    await mongoose.disconnect();
    console.log('Mongoose disconnected')
});

describe("User model", () => {
    afterEach(async () => {
        await User.deleteMany({});
    });

    const userPayload: UserInput = {
        email: "john@example.com",
        firstName: "John",
        lastName: "Doe",
        password: "johndpass123",
        gender: Gender.male,
        address: {
            street: "24 testing street",
            city: "Testville",
            postCode: "87560"
        }
    }

    const emptyUserPayload: UserInput = {
        email: " ",
        firstName: "",
        lastName: "",
        password: "",
        gender: Gender.male,
        address: {
            street: "24 testing street",
            city: "Testville",
            postCode: "87560"
        }
    }

    const wrongMailUserPayload: UserInput = {
        email: "john@example.",
        firstName: "John",
        lastName: "Doe",
        password: "johndpass123",
        gender: Gender.male,
        address: {
            street: "24 testing street",
            city: "Testville",
            postCode: "87560"
        }
    }

    const validCandidatePassword = "johndpass123"
    const unvalidCandidatePassword = "wrongpass"


    describe('Create user', () => {
        describe('given input is valid', () => {
            it('should create a new user', async () => {
                const user = await createUser(userPayload, validCandidatePassword);
                expect(user.password).toHaveLength(60);
                expect(user.firstName).toBe(userPayload.firstName);
                expect(user.lastName).toBe(userPayload.lastName);
                expect(user.email).toBe(userPayload.email);
                expect(user.gender).toBe(userPayload.gender);
                console.log(user)
            });
        });
        describe('given input is not valid',()=>{
            it('should throw an Error: "Please fill all required fields"', async () => {
                const user = createUser(emptyUserPayload, validCandidatePassword);
                await expect(user).rejects.toThrow(new Error("Please fill all required fields"))
            });

            it('should throw an Error: "Please enter a valid email"', async () => {
                const user = createUser(wrongMailUserPayload, validCandidatePassword);
                await expect(user).rejects.toThrow(new Error("Please enter a valid email"))
            });

            it('should throw an Error: "Passwords do not match"', async () => {
                const user = createUser(userPayload, unvalidCandidatePassword);
                await expect(user).rejects.toThrow(new Error('Passwords do not match'))
            });
            it('should throw an Error: "User already exist"', async function () {
                await createUser(userPayload, validCandidatePassword);
                const newUser = createUser(userPayload, validCandidatePassword);
                await expect(newUser).rejects.toThrow(new Error('User already exist'))
            });
        })
    });

    describe('Login user', () => {
        describe('given the password is correct', () => {
            it('should return true', async () => {
                const newUser = await createUser(userPayload, validCandidatePassword);
                const user = await loginUser({email: newUser.email, password: userPayload.password});
                expect(user.firstName).toBe(userPayload.firstName);
                expect(user.lastName).toBe(userPayload.lastName);
                expect(user.email).toBe(userPayload.email);
                expect(user.gender).toBe(userPayload.gender);

            });
        });
        describe('given email does not exist', () => {
            it('should throw an Error: User does not exist', async () => {
                await createUser(userPayload, validCandidatePassword);
                const action = async () => {
                    await loginUser({
                        email: "wrong@mail.com",
                        password: 'wrong'
                    });
                }
                await expect(action()).rejects.toThrow(new Error("User does not exist"));

            });
        });
        describe('given the password is wrong', () => {
            it('should throw an Error: Invalid password', async () => {
                const newUser = await createUser(userPayload, validCandidatePassword);
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
            await createUser(userPayload, validCandidatePassword);
            const user = await findUser({email: userPayload.email}, {lean: false});
            expect(user?.fullName).toBe(
                `${userPayload.firstName} ${userPayload.lastName}`
            );

        });
    })
});