import mongoose, {Schema, Document} from 'mongoose'
import bcrypt from 'bcryptjs'
import {CryptoData} from "../types/cryptoData";

type UploadedImage = {
    data: Buffer;
    contentType: string;
}

export interface UserInput{
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    watchlist?: string[];

    profilePicture?: UploadedImage;
}


export class UserClass implements UserInput {
    public email: string
    public firstName: string
    public lastName: string
    public password: string
    public watchlist?: CryptoData['id'][] = []
    public profilePicture?: UploadedImage

    constructor(email: string, firstName: string, lastName: string, password: string,watchlist?: CryptoData['id'][], profilePicture?: UploadedImage) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.profilePicture = profilePicture;
        this.watchlist = watchlist;
    }
    public async compareLoginPassword(candidatePassword: string):Promise<boolean>{
        return bcrypt.compare(candidatePassword,this.password).catch(() => false);
    }
}


export interface UserDocument extends UserClass, Document {
    fullName: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
    email: {type: String, required: true, unique: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    password: {type: String, required: true},
    watchlist: [{type: String,required: true}],
    profilePicture: {
        data: {type: Buffer},
        contentType: {type: String}
    }

}, {
    timestamps: true
});

//To indicate to Mongo to examinate that a document who have the "email" property will be unique
UserSchema.index({email: 1})

//To compose fullName virtual porperty that can get and set but do not get persisted to MongoDB
UserSchema.virtual('fullName').get(function (this: UserDocument) {
    return `${this.firstName} ${this.lastName}`
});
//Using pre middleware before saving a User
UserSchema.pre('save', async function (this: UserDocument, next) {
    // only has the password if it has been modified or is new
    if (!this.isModified("password")) return next();

    //Random additional data
    const salt = await bcrypt.genSalt(10);

    //Replace the password with the hash
    this.password = bcrypt.hashSync(this.password, salt);
    return next();
})

//Compare a candidate password with the user's password
UserSchema.methods.compareLoginPassword = UserClass.prototype.compareLoginPassword

export default mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema)