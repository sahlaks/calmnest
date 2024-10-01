import express from 'express';
import { DoctorController } from '../../controller/doctorController';
import { DoctorRepository } from '../repository/doctorRepository';
import { DoctorUseCase } from '../../usecases/doctorUsecases';
import SendEmail from '../services/mailService';
import { validateDoctorTokens } from '../middleware/tokenValidation';
import upload from '../services/upload';
import { SlotRepository } from '../repository/slotRepository';
import uploadDoc from '../services/uploadDoc';
import { AppointmentRepository } from '../repository/appointmentRepository';
import { AppointmentUseCase } from '../../usecases/appointmentUsecase';
import { AppointmentController } from '../../controller/appointmentController';
import { ParentRepository } from '../repository/parentRepository';

const doctorRouter = express.Router()
const sendEmail = new SendEmail()
const slotRepository = new SlotRepository()
const doctorRepository = new DoctorRepository()
const doctorUseCase = new DoctorUseCase(doctorRepository, sendEmail, slotRepository)
const controller = new DoctorController(doctorUseCase)


const parentRepository = new ParentRepository()
//appointment
const appointmentRepository = new AppointmentRepository()
const appointmentUsecase = new AppointmentUseCase(appointmentRepository,parentRepository,doctorRepository)
const appointmentController = new AppointmentController(appointmentUsecase);

//signup
doctorRouter.post('/signup',uploadDoc.single('document'),(req,res,next) => {
    controller.createDoctor(req,res,next);
})

//verify-otp
doctorRouter.post('/verify-otp',(req,res,next) => {
    controller.verifyOtp(req,res,next);
})

//resend-otp
doctorRouter.post('/resend-otp',(req,res,next) => {
    controller.resendOtp(req,res,next);
})

//login
doctorRouter.post('/login',(req,res,next) => {
    controller.loginDoctor(req,res,next);
})

//forgot-password
doctorRouter.post('/forgot-pwd',(req,res,next) => {
    console.log(req.body);
    
    controller.forgotPassword(req,res,next);
})

//verifyOtp
doctorRouter.post('/verifyOtp',(req,res,next) => {
    controller.verifyforForgotPassword(req,res,next);
})

//resendOtp
doctorRouter.post('/resendOtp',(req,res,next) => {
    controller.resendforForgotPassword(req,res,next);
})

//for new password
doctorRouter.post('/new-password',(req,res,next) => {
    controller.passwordSaver(req,res,next);
})


//fetch data
doctorRouter.get('/doctor-profile',validateDoctorTokens(doctorRepository),(req,res,next) => {
    controller.fetchDoctorData(req,res,next);
})

//update data
doctorRouter.post('/updateprofile',validateDoctorTokens(doctorRepository),upload,(req,res,next) => {
    controller.updateProfile(req,res,next);
})

//change password
doctorRouter.post('/change-password',validateDoctorTokens(doctorRepository),(req,res,next) => {
    controller.changePassword(req,res,next);
})

//refresh access token
doctorRouter.post('/refreshToken',(req,res,next)=>{
    controller.refreshToken(req,res,next);
})

//save time slots
doctorRouter.post('/slots',validateDoctorTokens(doctorRepository),(req,res,next) => {
 controller.saveSlots(req,res,next)
})

//fetch time slots
doctorRouter.get('/fetchslots',validateDoctorTokens(doctorRepository),(req,res,next)=>{
    controller.fetchSlots(req,res,next)
})

//change availability
doctorRouter.put('/:id/availability',validateDoctorTokens(doctorRepository),(req,res,next) => {
    controller.changeAvailability(req,res,next)
})

//delete slot
doctorRouter.delete('/:id/delete',validateDoctorTokens(doctorRepository),(req,res,next)=>{
    controller.deleteSlot(req,res,next)
})

//fetchappointments
doctorRouter.get('/getappointments', validateDoctorTokens(doctorRepository),(req,res,next)=>{
    appointmentController.getDoctorAppointments(req,res,next)
})

//changestatus
doctorRouter.put('/:id/status', validateDoctorTokens(doctorRepository), (req,res,next)=>{
    appointmentController.changeStatus(req,res,next)
})

//notifications
doctorRouter.get('/notifications/:id',validateDoctorTokens(doctorRepository), async(req,res,next) => {
    controller.getNotifications(req,res,next)
  })
  
//notification-read
doctorRouter.post('/mark-notification-read', validateDoctorTokens(doctorRepository), (req,res,next) => {
    controller.changeToRead(req,res,next)
  })
//logout
doctorRouter.post('/logout',(req,res,next) => {
    controller.logoutDoctor(req,res,next);
})
export default doctorRouter