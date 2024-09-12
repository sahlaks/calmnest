"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const parentSchema = new mongoose_1.default.Schema({
    parentName: {
        type: String,
    },
    image: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    mobileNumber: {
        type: String,
    },
    numberOfKids: {
        type: Number
    },
    isLoggin: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        default: "parent",
    },
    isGoogleSignUp: {
        type: Boolean,
        default: false,
    },
    street: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    country: {
        type: String,
    }
}, {
    timestamps: true
});
const parentModel = mongoose_1.default.model("Parent", parentSchema);
exports.default = parentModel;
