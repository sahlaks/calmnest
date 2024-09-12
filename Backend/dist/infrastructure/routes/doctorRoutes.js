"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const doctorController_1 = require("../../controller/doctorController");
const doctorRepository_1 = require("../repository/doctorRepository");
const doctorUsecases_1 = require("../../usecases/doctorUsecases");
const mailService_1 = __importDefault(require("../services/mailService"));
const documentUpload_1 = __importDefault(require("../services/documentUpload"));
const tokenValidation_1 = require("../middleware/tokenValidation");
const upload_1 = __importDefault(require("../services/upload"));
const slotRepository_1 = require("../repository/slotRepository");
const doctorRouter = express_1.default.Router();
const sendEmail = new mailService_1.default();
const slotRepository = new slotRepository_1.SlotRepository();
const doctorRepository = new doctorRepository_1.DoctorRepository();
const doctorUseCase = new doctorUsecases_1.DoctorUseCase(doctorRepository, sendEmail, slotRepository);
const controller = new doctorController_1.DoctorController(doctorUseCase);
//signup
doctorRouter.post('/signup', documentUpload_1.default, (req, res, next) => {
    controller.createDoctor(req, res, next);
});
//verify-otp
doctorRouter.post('/verify-otp', (req, res, next) => {
    controller.verifyOtp(req, res, next);
});
//resend-otp
doctorRouter.post('/resend-otp', (req, res, next) => {
    controller.resendOtp(req, res, next);
});
//login
doctorRouter.post('/login', (req, res, next) => {
    controller.loginDoctor(req, res, next);
});
//forgot-password
doctorRouter.post('/forgot-pwd', (req, res, next) => {
    console.log(req.body);
    controller.forgotPassword(req, res, next);
});
//verifyOtp
doctorRouter.post('/verifyOtp', (req, res, next) => {
    controller.verifyforForgotPassword(req, res, next);
});
//resendOtp
doctorRouter.post('/resendOtp', (req, res, next) => {
    controller.resendforForgotPassword(req, res, next);
});
//for new password
doctorRouter.post('/new-password', (req, res, next) => {
    controller.passwordSaver(req, res, next);
});
//fetch data
doctorRouter.get('/doctor-profile', (0, tokenValidation_1.validateDoctorTokens)(doctorRepository), (req, res, next) => {
    controller.fetchDoctorData(req, res, next);
});
//update data
doctorRouter.post('/updateprofile', (0, tokenValidation_1.validateDoctorTokens)(doctorRepository), upload_1.default, (req, res, next) => {
    controller.updateProfile(req, res, next);
});
//change password
doctorRouter.post('/change-password', (0, tokenValidation_1.validateDoctorTokens)(doctorRepository), (req, res, next) => {
    controller.changePassword(req, res, next);
});
//refresh access token
doctorRouter.post('/refreshToken', (req, res, next) => {
    controller.refreshToken(req, res, next);
});
//save time slots
doctorRouter.post('/slots', (0, tokenValidation_1.validateDoctorTokens)(doctorRepository), (req, res, next) => {
    controller.saveSlots(req, res, next);
});
//fetch time slots
doctorRouter.get('/fetchslots', (0, tokenValidation_1.validateDoctorTokens)(doctorRepository), (req, res, next) => {
    controller.fetchSlots(req, res, next);
});
//logout
doctorRouter.post('/logout', (req, res, next) => {
    controller.logoutDoctor(req, res, next);
});
exports.default = doctorRouter;
