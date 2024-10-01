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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const doctorController_1 = require("../../controller/doctorController");
const doctorRepository_1 = require("../repository/doctorRepository");
const doctorUsecases_1 = require("../../usecases/doctorUsecases");
const mailService_1 = __importDefault(require("../services/mailService"));
const tokenValidation_1 = require("../middleware/tokenValidation");
const upload_1 = __importDefault(require("../services/upload"));
const slotRepository_1 = require("../repository/slotRepository");
const uploadDoc_1 = __importDefault(require("../services/uploadDoc"));
const appointmentRepository_1 = require("../repository/appointmentRepository");
const appointmentUsecase_1 = require("../../usecases/appointmentUsecase");
const appointmentController_1 = require("../../controller/appointmentController");
const parentRepository_1 = require("../repository/parentRepository");
const doctorRouter = express_1.default.Router();
const sendEmail = new mailService_1.default();
const slotRepository = new slotRepository_1.SlotRepository();
const doctorRepository = new doctorRepository_1.DoctorRepository();
const doctorUseCase = new doctorUsecases_1.DoctorUseCase(doctorRepository, sendEmail, slotRepository);
const controller = new doctorController_1.DoctorController(doctorUseCase);
const parentRepository = new parentRepository_1.ParentRepository();
//appointment
const appointmentRepository = new appointmentRepository_1.AppointmentRepository();
const appointmentUsecase = new appointmentUsecase_1.AppointmentUseCase(appointmentRepository, parentRepository, doctorRepository);
const appointmentController = new appointmentController_1.AppointmentController(appointmentUsecase);
//signup
doctorRouter.post('/signup', uploadDoc_1.default.single('document'), (req, res, next) => {
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
//change availability
doctorRouter.put('/:id/availability', (0, tokenValidation_1.validateDoctorTokens)(doctorRepository), (req, res, next) => {
    controller.changeAvailability(req, res, next);
});
//delete slot
doctorRouter.delete('/:id/delete', (0, tokenValidation_1.validateDoctorTokens)(doctorRepository), (req, res, next) => {
    controller.deleteSlot(req, res, next);
});
//fetchappointments
doctorRouter.get('/getappointments', (0, tokenValidation_1.validateDoctorTokens)(doctorRepository), (req, res, next) => {
    appointmentController.getDoctorAppointments(req, res, next);
});
//changestatus
doctorRouter.put('/:id/status', (0, tokenValidation_1.validateDoctorTokens)(doctorRepository), (req, res, next) => {
    appointmentController.changeStatus(req, res, next);
});
//notifications
doctorRouter.get('/notifications/:id', (0, tokenValidation_1.validateDoctorTokens)(doctorRepository), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    controller.getNotifications(req, res, next);
}));
//notification-read
doctorRouter.post('/mark-notification-read', (0, tokenValidation_1.validateDoctorTokens)(doctorRepository), (req, res, next) => {
    controller.changeToRead(req, res, next);
});
//logout
doctorRouter.post('/logout', (req, res, next) => {
    controller.logoutDoctor(req, res, next);
});
exports.default = doctorRouter;
