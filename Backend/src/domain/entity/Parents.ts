import { Document } from "mongoose";

interface IParent extends Document {
    _id: string
    parentName: string
    image: string
    email: string
    password: string
    mobileNumber: string
    isLoggin: boolean
    isBlocked: boolean
    role: string
    isGoogleSignUp: boolean
    createdAt: Date
    updateAt: Date
    numberOfKids: number
    street: string;
    city: string;
    state: string;
    country: string;

}

export default IParent