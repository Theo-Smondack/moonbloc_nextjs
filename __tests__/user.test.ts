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

            it('should return "Passwords do not match"', async () => {
                const user = createUser(userPayload, unvalidCandidatePassword);
                await expect(user).rejects.toThrowError('Passwords do not match')
            });
            it('should return "User already exist"', async function () {
                await createUser(userPayload, validCandidatePassword);
                const newUser = createUser(userPayload, validCandidatePassword);
                await expect(newUser).rejects.toThrowError('User already exist')
            });

        });
    });

    describe('Login user', () => {
        describe('given the password is correct', () => {
            it('should return true', async () => {
                const user = await createUser(userPayload, validCandidatePassword);
                const isValid = await loginUser({email: user.email, password: userPayload.password});
                expect(isValid).toBeTruthy();

            });
        });
        describe('given the password is wrong', () => {
            it('should return false', async () => {
                const user = await createUser(userPayload, validCandidatePassword);
                const isValid = await loginUser({
                    email: user.email,
                    password: 'wrong'
                });
                expect(isValid).toBeFalsy();

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