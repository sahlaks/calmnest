import { Document } from "mongodb";

interface IDoctor extends Document {
    _id: string
    doctorName: string
    email: string
    password: string
    mobileNumber: string
    licenseGrade: string
    age: number
    specialization: string
    image: string
    gender: string
    street: string
    city: string
    dob: string
    state: string
    country: string
    fees: number
    isVerified: boolean
    isBlocked: boolean
    role: string
    isGoogleSignUp: boolean
    document: string
    createdAt: Date
    updateAt: Date
}

export default IDoctor
