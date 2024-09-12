"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDoctorTokens = exports.validateTokens = void 0;
const tokenVerification_1 = require("../services/tokenVerification");
/*.................................for parent............................................*/
const validateTokens = (parentRepository) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const accessToken = req.cookies.access_token;
            const refreshToken = req.cookies.refresh_token;
            if (!refreshToken)
                res.status(401).json({ message: "Refresh Token Expired" });
            const refreshTokenValid = (0, tokenVerification_1.verifyRefreshToken)(refreshToken);
            console.log(refreshTokenValid);
            const user = yield parentRepository.findDetailsById(refreshTokenValid.id);
            console.log(user);
            if (!refreshTokenValid.id || !user) {
                res
                    .status(401)
                    .json({ success: false, message: "Refresh Token Expired" });
            }
            if (!accessToken) {
                res.status(401).json({ success: false, message: "Access Token Expired" });
            }
            else {
                const decoded = (0, tokenVerification_1.verifyAccessToken)(accessToken);
                if (!decoded.id || !decoded) {
                    res.status(401).json({ success: false, message: "Access Token Expired" });
                }
                else {
                    const existingUser = yield parentRepository.findDetailsById(decoded.id);
                    if (!existingUser) {
                        res.status(404).json({ message: "User not found" });
                    }
                    req.user = { id: refreshTokenValid.id };
                    next();
                }
            }
        }
        catch (err) { }
    });
};
exports.validateTokens = validateTokens;
/*..........................................for doctor validation.................................*/
const validateDoctorTokens = (doctorRepository) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const accessToken = req.cookies.doc_auth_token;
            const refreshToken = req.cookies.doc_refresh_token;
            if (!refreshToken)
                res.status(401).json({ message: "Refresh Token Expired" });
            const refreshTokenValid = (0, tokenVerification_1.verifyRefreshToken)(refreshToken);
            console.log(refreshTokenValid);
            const user = yield doctorRepository.findDetailsById(refreshTokenValid.id);
            console.log(user);
            if (!refreshTokenValid.id || !user) {
                res
                    .status(401)
                    .json({ success: false, message: "Refresh Token Expired" });
            }
            if (!accessToken) {
                res.status(401).json({ success: false, message: "Access Token Expired" });
            }
            else {
                const decoded = (0, tokenVerification_1.verifyAccessToken)(accessToken);
                if (!decoded.id || !decoded) {
                    res.status(401).json({ success: false, message: "Access Token Expired" });
                }
                else {
                    const existingUser = yield doctorRepository.findDetailsById(decoded.id);
                    if (!existingUser) {
                        res.status(404).json({ message: "User not found" });
                    }
                    req.user = { id: refreshTokenValid.id };
                    next();
                }
            }
        }
        catch (err) { }
    });
};
exports.validateDoctorTokens = validateDoctorTokens;
