"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const doctorSchema = new mongoose_1.default.Schema({
    doctorName: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    mobileNumber: {
        type: String
    },
    licenseGrade: {
        type: String
    },
    age: {
        type: Number
    },
    specialization: {
        type: String
    },
    image: {
        type: String
    },
    gender: {
        type: String
    },
    street: {
        type: String
    },
    city: {
        type: String
    },
    dob: {
        type: String
    },
    state: {
        type: String
    },
    country: {
        type: String
    },
    fees: {
        type: Number
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'doctor'
    },
    isGoogleSignUp: {
        type: Boolean,
        default: false
    },
    document: {
        type: String
    },
}, {
    timestamps: true
});
const doctorModel = mongoose_1.default.model('Doctor', doctorSchema);
exports.default = doctorModel;
