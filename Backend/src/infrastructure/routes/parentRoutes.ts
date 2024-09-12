import express from "express";
import { ParentController } from "../../controller/parentController";
import { ParentUseCase } from "../../usecases/parentUsecases";
import { ParentRepository } from "../repository/parentRepository";
import SendEmail from "../services/mailService";
import { validateTokens } from "../middleware/tokenValidation";
import {ChildRepository} from "../repository/childRepository";
import upload from "../services/upload";
import { DoctorRepository } from "../repository/doctorRepository";
import { SlotRepository } from "../repository/slotRepository";



const parentRouter = express.Router()
const sendEmail = new SendEmail()
const childRepository = new ChildRepository()
const doctorRepository = new DoctorRepository()
const slotRepository = new SlotRepository()
const parentRepository = new ParentRepository();
const parentUseCase = new ParentUseCase( parentRepository,sendEmail,childRepository,doctorRepository,slotRepository);
const controller = new ParentController(parentUseCase);

//signup
parentRouter.post('/signup',(req,res,next) => {
    controller.createParent(req,res,next)
})

//verify-otp
parentRouter.post('/verify-otp',(req,res,next) => {
    controller.verifyOtp(req,res,next);
})

//login
parentRouter.post('/login',(req,res,next) => {
    controller.loginParent(req,res,next)
 })

 //google authentication
 parentRouter.post('/google/auth',(req,res,next) => {
    controller.googleAuth(req,res,next);
 })

 parentRouter.post('/check-google-auth',(req,res,next) => {
    controller.checkGoogleAuth(req,res,next);
 })

//resend-otp
 parentRouter.post('/resend-otp',(req,res,next) => {
    controller.resendOtp(req,res,next);
})
  
//forgot-password
parentRouter.post('/forgot-pwd',(req,res,next) => {
    controller.forgotPassword(req,res,next);
})

//verifyOtp
parentRouter.post('/verifyOtp',(req,res,next) => {
    console.log(req.body);
    controller.verifyForgotPassword(req,res,next);
})

//resendOtp
parentRouter.post('/resendOtp',(req,res,next) => {
    controller.resendforForgotPassword(req,res,next);
})

//for new password
parentRouter.post('/new-password',(req,res,next) => {
    controller.passwordSaver(req,res,next);
})

//fetch data for profile
parentRouter.get('/parentprofile',validateTokens(parentRepository), (req,res,next) => {
    controller.fetchData(req,res,next);
})

//refresh access token
parentRouter.post('/refreshToken',(req,res,next)=>{
    controller.refreshToken(req,res,next);
})

//update profile
parentRouter.post('/updateParentProfile',validateTokens(parentRepository), upload ,(req,res,next) => { 
   controller.updateProfile(req,res,next);
})

//remove kid
parentRouter.delete('/remove-kid/:id',validateTokens(parentRepository), (req,res,next) => {
    console.log(req.params.id);
    controller.deleteChildData(req,res,next)
})

//change password
parentRouter.post('/change-password',validateTokens(parentRepository),(req,res,next) => {
    controller.changePassword(req,res,next);
})

//fetch doctors
parentRouter.get('/details/:id/doctor',validateTokens(parentRepository),(req,res,next) => {
    console.log('route fetch');
    controller.fetchDoctorDetails(req,res,next)
})

//child details
parentRouter.get('/child-details',validateTokens(parentRepository),(req,res,next) => {
    controller.fetchChildData(req,res,next)
})
//logout
parentRouter.post('/logout',(req,res,next)=>{
    controller.logoutUser(req,res,next);
})

export default parentRouter