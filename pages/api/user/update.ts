import {NextApiRequest, NextApiResponse} from "next";
import DbConnection from "../../../helpers/dbConnection";
import {UserDocument, UserInput} from "../../../models/User";
import {updateUser} from "../../../services/users";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await DbConnection.getInstance()
    const {method} = req
    if (method === "POST") {
        try {
            const email = req.body.email as UserDocument['email']
            const update = req.body.update as Partial<UserInput>
            const newUser = await updateUser(email, update)
            return res.status(201).json({ok: true, newUser: newUser})
        } catch (error) {
            return res.status(422).json({ok: false, error: (error as Error).message})
        }
    }
    return res.status(405).json({ok:false})
}