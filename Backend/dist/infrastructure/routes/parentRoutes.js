"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const parentController_1 = require("../../controller/parentController");
const parentUsecases_1 = require("../../usecases/parentUsecases");
const parentRepository_1 = require("../repository/parentRepository");
const mailService_1 = __importDefault(require("../services/mailService"));
const tokenValidation_1 = require("../middleware/tokenValidation");
const childRepository_1 = require("../repository/childRepository");
const upload_1 = __importDefault(require("../services/upload"));
const doctorRepository_1 = require("../repository/doctorRepository");
const slotRepository_1 = require("../repository/slotRepository");
const parentRouter = express_1.default.Router();
const sendEmail = new mailService_1.default();
const childRepository = new childRepository_1.ChildRepository();
const doctorRepository = new doctorRepository_1.DoctorRepository();
const slotRepository = new slotRepository_1.SlotRepository();
const parentRepository = new parentRepository_1.ParentRepository();
const parentUseCase = new parentUsecases_1.ParentUseCase(parentRepository, sendEmail, childRepository, doctorRepository, slotRepository);
const controller = new parentController_1.ParentController(parentUseCase);
//signup
parentRouter.post('/signup', (req, res, next) => {
    controller.createParent(req, res, next);
});
//verify-otp
parentRouter.post('/verify-otp', (req, res, next) => {
    controller.verifyOtp(req, res, next);
});
//login
parentRouter.post('/login', (req, res, next) => {
    controller.loginParent(req, res, next);
});
//google authentication
parentRouter.post('/google/auth', (req, res, next) => {
    controller.googleAuth(req, res, next);
});
parentRouter.post('/check-google-auth', (req, res, next) => {
    controller.checkGoogleAuth(req, res, next);
});
//resend-otp
parentRouter.post('/resend-otp', (req, res, next) => {
    controller.resendOtp(req, res, next);
});
//forgot-password
parentRouter.post('/forgot-pwd', (req, res, next) => {
    controller.forgotPassword(req, res, next);
});
//verifyOtp
parentRouter.post('/verifyOtp', (req, res, next) => {
    console.log(req.body);
    controller.verifyForgotPassword(req, res, next);
});
//resendOtp
parentRouter.post('/resendOtp', (req, res, next) => {
    controller.resendforForgotPassword(req, res, next);
});
//for new password
parentRouter.post('/new-password', (req, res, next) => {
    controller.passwordSaver(req, res, next);
});
//fetch data for profile
parentRouter.get('/parentprofile', (0, tokenValidation_1.validateTokens)(parentRepository), (req, res, next) => {
    controller.fetchData(req, res, next);
});
//refresh access token
parentRouter.post('/refreshToken', (req, res, next) => {
    controller.refreshToken(req, res, next);
});
//update profile
parentRouter.post('/updateParentProfile', (0, tokenValidation_1.validateTokens)(parentRepository), upload_1.default, (req, res, next) => {
    controller.updateProfile(req, res, next);
});
//remove kid
parentRouter.delete('/remove-kid/:id', (0, tokenValidation_1.validateTokens)(parentRepository), (req, res, next) => {
    console.log(req.params.id);
    controller.deleteChildData(req, res, next);
});
//change password
parentRouter.post('/change-password', (0, tokenValidation_1.validateTokens)(parentRepository), (req, res, next) => {
    controller.changePassword(req, res, next);
});
//fetch doctors
parentRouter.get('/details/:id/doctor', (0, tokenValidation_1.validateTokens)(parentRepository), (req, res, next) => {
    console.log('route fetch');
    controller.fetchDoctorDetails(req, res, next);
});
//child details
parentRouter.get('/child-details', (0, tokenValidation_1.validateTokens)(parentRepository), (req, res, next) => {
    controller.fetchChildData(req, res, next);
});
//logout
parentRouter.post('/logout', (req, res, next) => {
    controller.logoutUser(req, res, next);
});
exports.default = parentRouter;
