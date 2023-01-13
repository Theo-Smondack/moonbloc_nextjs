import mongoose, {Schema, Document} from 'mongoose'
import bcrypt from 'bcrypt'

export enum Gender {
    male = 'male',
    female = 'female'
}

interface Address {
    street?: string;
    city?: string;
    postCode?: string;
}

export interface UserInput extends Address{
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    gender?: Gender;
    address?: Address
}


export class UserClass implements UserInput {
    public email: string
    public firstName: string
    public lastName: string
    public password: string
    public gender?: Gender
    public address?: Address

    constructor(email: string, firstName: string, lastName: string, password: string, gender?: Gender, address?: Address) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.gender = gender;
        this.address = address;
    }
    public async compareLoginPassword(candidatePassword: string):Promise<boolean>{
        return bcrypt.compare(candidatePassword,this.password).catch(() => false);
    }

    public async compareRegisterPassword(candidatePassword:string):Promise<boolean>{
        return candidatePassword === this.password
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
    gender: {type: String, enum: Object.values(Gender)},
    address: {
        street: {type: String},
        city: {type: String},
        postCode: {type: String}
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
UserSchema.methods.compareRegisterPassword = UserClass.prototype.compareRegisterPassword

export default mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema)