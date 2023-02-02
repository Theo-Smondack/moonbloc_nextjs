import User, {UserDocument, UserInput, UserClass} from "../models/User";
import {FilterQuery, QueryOptions} from "mongoose";
import {isCollectionExist} from "../utils/toolFunctions";

export async function createUser(input: UserInput) {
    const user: UserClass = new UserClass(input.email, input.firstName, input.lastName, input.password, input.gender, input.address)
    const userExist = await User.findOne({email:user.email},'email',{lean:true})
    if (userExist){
        throw new Error("User already exist")
    }
    return User.create(user)
}

export async function findUser(query: FilterQuery<UserDocument>, options: QueryOptions<UserDocument> = {lean: true}) {
    return User.findOne(query, null, options);
}

export async function loginUser({email, password}: { email: UserDocument['email'], password: UserDocument['password'] }) {
    const user = await findUser({email}, {lean: false});
    if (!user || !await isCollectionExist('users')) {
        throw new Error("User does not exist");
    }
    if (!await (user as UserClass).compareLoginPassword(password)){
        throw new Error("Invalid password");
    }
    return user
}