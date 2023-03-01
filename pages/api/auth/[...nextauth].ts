import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import {loginUser} from "../../../services/users";
import {UserDocument} from "../../../models/User";
import DbConnection from "../../../utils/dbConnection";


export const authOptions = {
    providers: [
        CredentialsProvider({
            type: 'credentials',
            credentials: {
                email: {},
                password: {}
            },
            async authorize(credentials) {
                await DbConnection.getInstance()
                if (credentials) {
                    const email = credentials.email as UserDocument["email"]
                    const password = credentials.password as UserDocument["password"]
                    try {
                        const user: UserDocument = await loginUser({email: email, password: password})
                        return {email: user.email, name: user.firstName, id: JSON.stringify(user._id)}
                    } catch (e) {
                        throw Error((e as Error).message)
                    }
                }
                return null
            },



        })

    ],
    jwt:{
        maxAge:5
    },
}

export default NextAuth(authOptions)