import IParent from "../domain/entity/Parents";
import { AuthRequest } from "../domain/entity/types/auth";
import SendEmail from "../infrastructure/services/mailService";
import { generateOTP } from "../infrastructure/services/otpGenerator";
import { IParentRepository } from "./interface/IParentRepository";
import { Request } from "express";
import bcrypt from "bcrypt";
import {
  jwtCreation,
  refreshToken,
} from "../infrastructure/services/JwtCreation";
import { generateRandomPassword } from "../infrastructure/services/generatePassword";
import IChild from "../domain/entity/Child";
import { IChildRepository } from "./interface/IChildRepository";
import mongoose from "mongoose";
import { IDoctorRepository } from "./interface/IDoctorRepository";
import IDoctor from "../domain/entity/doctor";
import ISlot from "../domain/entity/slots";
import { ISlotRepository } from "./interface/ISlotRepository";

export class ParentUseCase {
  private iparentRepository: IParentRepository;
  private ichildRepository: IChildRepository;
  private idoctorRepository: IDoctorRepository;
  private islotRepository: ISlotRepository;
  private sendEmail: SendEmail;

  constructor(parentRepository: IParentRepository, sendEmail: SendEmail, childRepository: IChildRepository, doctorRepository: IDoctorRepository, slotRepository: ISlotRepository) {
    this.iparentRepository = parentRepository;
    this.sendEmail = sendEmail;
    this.ichildRepository = childRepository
    this.idoctorRepository = doctorRepository
    this.islotRepository = slotRepository
  }


  /*......................................find user by email and send otp to it.........................................*/
  async registrationParent(
    req: Request
  ): Promise<{ status: boolean; message?: string }> {
    try {
      const signupData = req.session.signupData;
      const email = signupData?.email as string;
      //check user
      const existingUser = await this.iparentRepository.findParentByEmail(
        email
      );
      if (existingUser) {
        return { status: false, message: "Email already registered" };
      }

      const otp = generateOTP();
      req.session.otp = otp;
      const mailOptions = {
        email,
        subject: "Your OTP for CalmNest Signup",
        code: otp,
      };
      await this.sendEmail.sendEmail(mailOptions);
      return { status: true, message: "OTP sent successfully" };
    } catch (error) {
      // Handle unexpected errors
      console.error("Error during parent registration:", error);
      return {
        status: false,
        message: "An error occurred during registration",
      };
    }
  }


  /*.....................................verify email and save data............................................*/
  async saveUser(data: IParent): Promise<{
    status: boolean;
    message?: string;
    user?: IParent;
    accesstoken?: string;
    refreshtoken?: string;
  }> {
    try {
      // Hash the password before saving
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
      data.isLoggin = true;

      const savedUser = await this.iparentRepository.saveUserDetails(data);
      console.log(savedUser);

      if (savedUser) {
        const accesstoken = jwtCreation(savedUser._id);
        const refreshtoken = refreshToken(savedUser._id);

        return {
          status: true,
          message: "User registered successfully",
          user: savedUser,
          accesstoken,
          refreshtoken,
        };
      } else {
        return { status: false, message: "Failed to register user" };
      }
    } catch (error) {
      console.error("Error in saveUser:", error);
      return {
        status: false,
        message: "An error occurred during registration",
      };
    }
  }


  /*........................................validate a parent in login...................................*/
  async validateParent(
    email: string,
    password: string
  ): Promise<{
    status: boolean;
    data?: IParent;
    message?: string;
    accesstoken?: string;
    refreshtoken?: string;
  }> {
    try {
      //check user
      const existingUser = await this.iparentRepository.findParentByEmail(
        email
      );
      console.log(existingUser);

      if (existingUser) {
        //check blocked or not
        if(existingUser.isBlocked){
          return {status: false, message:' Sorry! Your account is blocked'}
        }
        // Check password
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (isMatch) {
          const accesstoken = jwtCreation(existingUser._id);
          const refreshtoken = refreshToken(existingUser._id);
          return {
            status: true,
            message: "Valid credentials",
            data: existingUser,
            accesstoken,
            refreshtoken,
          };
        } else {
          return { status: false, message: "Wrong password" };
        }
      } else {
        return { status: false, message: "User does not exist!" };
      }
    } catch (error) {
      console.error("Error in login:", error);
      return {
        status: false,
        message: "An error occurred during registration",
      };
    }
  }


  /*..............................................send otp...................................................*/
  async sendOtp(
    email: string
  ): Promise<{ status: boolean; message?: string; otp?: string }> {
    try {
      const otp = generateOTP();
      const mailOptions = {
        email,
        subject: "Your OTP for CalmNest",
        code: otp,
      };
      await this.sendEmail.sendEmail(mailOptions);
      return { status: true, message: "OTP sent successfully", otp };
    } catch (error) {
      console.error("Error during resend otp:", error);
      return { status: false, message: "An error occurred during resend otp" };
    }
  }

  /*.......................................verify email for forgot password.....................................*/
  async verifyEmail(
    email: string
  ): Promise<{ status: boolean; message?: string; otp?: string }> {
    try {
      const user = await this.iparentRepository.findParentByEmail(email);
      if (user) {
        const otp = generateOTP();
        const mailOptions = {
          email,
          subject: "Your OTP for changing password",
          code: otp,
        };
        await this.sendEmail.sendEmail(mailOptions);
        return { status: true, message: "OTP sent successfully", otp };
      } else {
        return { status: false, message: "You are not registered yet!!" };
      }
    } catch (error) {
      console.error("Error during sending otp:", error);
      return { status: false, message: "An error occurred during resend otp" };
    }
  }


  /*............................................saving new password......................................*/
  async savePassword(
    email: string,
    password: string
  ): Promise<{ status: boolean; message?: string }> {
    try {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
      const savedUser = await this.iparentRepository.updateUserDetails(
        email,
        password
      );
      if (savedUser)
        return { status: true, message: "Updated password successfully!" };
      else return { status: false, message: "Updation failed.." };
    } catch (error) {
      console.error("Error during password updation", error);
      return {
        status: false,
        message: "An error occurred during password updation",
      };
    }
  }


  /*...............................data by ID.......................................*/
  async findParentById(
    id: string
  ): Promise<{ status: boolean; message?: string; parent?: IParent }> {
    try {
      const parent = await this.iparentRepository.findDetailsById(id);
      
      if (parent) {
        return { status: true, message: "User exist", parent };
      } else {
        return { status: false, message: "User not exist" };
      }
    } catch (error) {
      return {
        status: false,
        message: "An error occured during fetching data",
      };
    }
  }


  /*.......................................google auth..........................*/
  async findParentByEmail(user: IParent): Promise<{
    status: boolean;
    message?: string;
    parent?: IParent;
    accesstoken?: string;
    refreshtoken?: string;
  }> {
    try {
      const parent = await this.iparentRepository.findParentByEmail(user.email);
      if (parent) {
        const accesstoken = jwtCreation(parent._id);
        const refreshtoken = refreshToken(parent._id);
        return {
          status: true,
          message: "User exist",
          parent,
          accesstoken,
          refreshtoken,
        };
      } else {
        let password = generateRandomPassword(8);
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        const isGoogleSignUp = true;
        const parent = await this.iparentRepository.saveUser(
          user,
          password,
          isGoogleSignUp
        );

        if (parent) {
          const accesstoken = jwtCreation(parent._id);
          const refreshtoken = refreshToken(parent._id);

          return {
            status: true,
            message: "User authenticated and added",
            parent,
            accesstoken,
            refreshtoken,
          };
        }
      }
      return { status: false, message: "Error in user authentication" };
    } catch (error) {
      return {
        status: false,
        message: "An error occured during authenticating data",
      };
    }
  }


  /*.................................find with email for google authentication..........................*/
  async findParentWithEmail(
    email: string
  ): Promise<{ status: boolean; isGoogleAuth: boolean }> {
    try {
      const user = await this.iparentRepository.findParentByEmail(email);
      if (user) {
        if (user.isGoogleSignUp) {
          return { status: true, isGoogleAuth: true };
        } else {
          return { status: false, isGoogleAuth: false };
        }
      } else {
        return { status: false, isGoogleAuth: false };
      }
    } catch (error) {
      console.error("Error checking Google auth:", error);
      return { status: false, isGoogleAuth: false };
    }
  }
  
  /*..............................find child data with parent Id.......................................*/
  async findChildData(id: string): Promise<{status: boolean, message?: string, child?: IChild[]}>{
    const parentId = new mongoose.Types.ObjectId(id)
    try{
      const data = await this.ichildRepository.findChild(parentId)
      console.log('child',data);
      
      if(data){
        return {status: true, message: 'Data exist', child: data}
      }
      return {status: false, message: 'Child data not exist'}
    } catch(error){
      return {status: false, message: 'Failure to find data'}
    }
  }
  
  /*.............................................save parent and kids data....................................*/
  async addParentandKids(parentData: IParent, child: IChild[]): Promise<{status: boolean; message?: string; child?: IChild[]}>{
    try{
      const savedParent = await this.iparentRepository.saveParent(parentData)
      console.log('usecase',savedParent);
      if (!savedParent) {
        return { status: false, message: 'Failed to save parent' };
      }
      console.log(child);
      
      if (!Array.isArray(child) || child.length === 0) {
        return { status: true, message: 'Parent details updated successfully without child data' };
      }

      const parentId = new mongoose.Types.ObjectId(savedParent._id);
      console.log('id',parentId);

        const existingChild = await this.ichildRepository.validateChild(child,parentId)
        console.log('exis',existingChild);
        
        if(existingChild){
          return { status: false, message: 'Child data already exist in database '}
        }

        const savedChildren = await this.ichildRepository.saveChild(child, parentId)
        console.log('child data', savedChildren);
        
        if (!savedChildren) {
          return { status: false, message: 'Failed to save children' };
      }
      
    
      return {status: true, message: 'Updated data successfully', child: savedChildren}
    } catch(error){
      return {status: false, message: 'Failure to update data'}
    }
  }

  /*...........................................remove kid data with id..................................*/
  async deleteKidById(id: string): Promise<{status: boolean; message?: string}>{
    try{
      const deletekid = await this.ichildRepository.deleteById(id)
      if (!deletekid) return { status: false, message: 'Kid not found' };
      return { status: true, message: 'Kid deleted successfully' };
    } catch(error){
      return { status: false, message: 'Server error' };
    }
  }

   /*................................verify password...................................*/
   async verifyPassword(id: string, password: string): Promise<{status: boolean; message?: string}>{
    try{
    const existingUser = await this.iparentRepository.findDetailsById(id);
    console.log('use',existingUser);
    
    if(existingUser){
       // Check password
       const isMatch = await bcrypt.compare(password, existingUser.password);
       if(isMatch)
            return {status: true, message: 'Matching Password'}
        else
            return {status: false, message: 'Wrong Password!..Please enter the matching one'}
    }else{
        return {status: false, message: 'User does not exist'}
    }
}catch(error){
    return { status: false, message: 'An error occurred during fetching data'};
}
}


/*..................................find with id and update password....................................*/
async findParentwithIdandUpdate(id: string, password: string): Promise<{status: boolean, message?: string}>{
  try{
     const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
      const savedUser =  await this.iparentRepository.updateParentPassword(id,password);
      if(savedUser)
          return {status: true, message: 'Updated password successfully!'}
      else
          return {status: false, message: 'Updation failed..'}   
  } catch(error){
      console.error('Error during password updation', error);
      return { status: false, message: 'An error occurred during password updation'};
  }
}

/*..................................doctor and its slots........................................*/
async findDoctor(id: string): Promise<{status: boolean; message?: string; data?: IDoctor; slots?: ISlot[]}>{
  try{
    const res = await this.idoctorRepository.findDetailsById(id)
    if(res){
      const slots = await this.islotRepository.fetchAvailableSlots(id)
      if(slots) return {status: true, message:'Data fetched along with slots',data: res, slots}
      return {status: true, message: 'Doctor details fetched', data: res}
    }
    return {status: false, message: 'No data available'}
  }catch(error){
    return { status: false, message: 'An error occurred during data fetching'};
}

}

}

