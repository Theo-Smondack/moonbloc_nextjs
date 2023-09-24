import User, { UserClass, UserDocument, UserInput } from '../models/User';
import { FilterQuery, QueryOptions } from 'mongoose';
import { CryptoData } from '../types/cryptoData';
import { findWallets } from './wallet';
import { WalletDocument } from '../models/Wallet';

export async function createUser(input: UserInput) {
    const user: UserClass = new UserClass(input.email, input.firstName, input.lastName, input.password, input.watchlist as CryptoData['id'][], input.profilePicture)
    const userExist = await User.findOne({ email: user.email }, 'email', { lean: true })
    if (userExist) {
        throw new Error('User already exist')
    }
    return User.create(user)
}

export async function findUser(query: FilterQuery<UserDocument>, options: QueryOptions<UserDocument> = { lean: true }) {
    const user = await User.findOne(query, null, options);
    if (!user) {
        throw new Error('User does not exist');
    }
    return user

}

export async function loginUser({ email, password }: { email: UserDocument['email'], password: UserDocument['password'] }) {
    let user
    try {
        user = await findUser({ email }, { lean: false });
    } catch (e) {
        throw new Error((e as Error).message);
    }

    if (!await (user as UserClass).compareLoginPassword(password)) {
        throw new Error('Invalid password');
    }


    return user
}

export async function getUserWatchlist(email: UserDocument['email']) {
    let user
    try {
        user = await findUser({ email }, { lean: false });
    } catch (e) {
        throw new Error((e as Error).message);
    }
    return user.watchlist
}

export async function getUserWallets(email: UserDocument['email']): Promise<WalletDocument[]> {
    let user
    try {
        user = await findUser({ email }, { lean: false });
    } catch (e) {
        throw new Error((e as Error).message);
    }
    return await findWallets({ userID: user._id })
}

export async function updateUser(email: UserDocument['email'], update: Partial<UserInput>) {
    try {
        await findUser({ email }, { lean: false });
    } catch (e) {
        throw new Error((e as Error).message);
    }
    return User.findOneAndUpdate({ email }, update, { new: true })
}