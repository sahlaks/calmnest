import { NextFunction, Request, Response } from "express";
import { ParentUseCase } from "../usecases/parentUsecases";
import IParent from "../domain/entity/Parents";
import { AuthRequest } from "../domain/entity/types/auth";
import { verifyRefreshToken } from "../infrastructure/services/tokenVerification";
import { jwtCreation } from "../infrastructure/services/JwtCreation";
import { uploadImage } from "../infrastructure/services/cloudinaryService";
import mongoose from "mongoose";

export class ParentController {
  constructor(private ParentUseCase: ParentUseCase) {}

  /*..................................Signup....................................................*/
  async createParent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { parentName, email, mobileNumber, password } = req.body;
      req.session.signupData = {
        parentName,
        email,
        mobileNumber,
        password,
      };
      const result = await this.ParentUseCase.registrationParent(req);

      if (result.status) {
        return res.status(200).json({
          success: true,
          message: "OTP send to your email",
        });
      } else {
        return res.json({
          success: false,
          message: result.message,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  /*....................................verify-otp..............................................*/
  async verifyOtp(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { otp } = req.body;
      console.log("controller", otp);

      const sessionOtp = req.session.otp;
      const signupData = req.session.signupData;
      console.log("session", signupData);
      console.log(sessionOtp);

      if (!signupData) {
        return res
          .status(400)
          .json({ success: false, message: "No signup data found" });
      }

      if (otp !== sessionOtp) {
        return res.json({ success: false, message: "Incorrect OTP" });
      }

      const result = await this.ParentUseCase.saveUser(signupData as IParent);
      if (result.status) {
        res.cookie("access_token", result.accesstoken, { httpOnly: true });
        res.cookie("refresh_token", result.refreshtoken, { httpOnly: true });
        if (result.user?.password) {
          delete (result.user as { password?: string }).password;
        }
        return res
          .status(200)
          .json({ success: true, message: result.message, user: result.user });
      } else {
        return res.json({ success: false, message: result.message });
      }
    } catch (error) {
      next(error);
    }
  }

  /*...........................................resend otp..........................................*/
  async resendOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const email = req.session.signupData?.email as string;
      const result = await this.ParentUseCase.sendOtp(email);
      if (result.status) {
        req.session.otp = result.otp;
        return res.status(200).json({
          success: true,
          message: "OTP send to your email",
        });
      } else {
        return res.json({
          success: false,
          message: result.message,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  /*.................................login...................................*/
  async loginParent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { email, password } = req.body;
      const result = await this.ParentUseCase.validateParent(email, password);
      if (result.status) {
        if (result.data?.password) {
          delete (result.data as { password?: string }).password;
        }
        console.log("after deleting", result.data);

        res.cookie("access_token", result.accesstoken, { httpOnly: true });
        res.cookie("refresh_token", result.refreshtoken, { httpOnly: true });
        return res.status(200).json({ success: true, data: result.data });
      } else {
        return res
          .status(400)
          .json({ success: false, message: result.message });
      }
    } catch (error) {
      next(error);
    }
  }

  /*...................................check google auth........................................*/
  async checkGoogleAuth(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { email } = req.body;

      const result = await this.ParentUseCase.findParentWithEmail(email);
      if (result.status) {
        res.json({ success: true, isGoogleAuth: true });
      } else {
        res.json({ success: false, isGoogleAuth: false });
      }
    } catch (error) {
      next(error);
    }
  }
  /*.........................................google authentication...............................................*/
  async googleAuth(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const user = req.body;
      const result = await this.ParentUseCase.findParentByEmail(user);
      console.log(result);

      if (result.status) {
        if (result.message === "User exist") {
          res.cookie("access_token", result.accesstoken, { httpOnly: true });
          res.cookie("refresh_token", result.refreshtoken, { httpOnly: true });
          return res.status(200).json({
            success: true,
            message: result.message,
            data: result.parent,
          });
        } else if (result.message === "User authenticated and added") {
          res.cookie("access_token", result.accesstoken, { httpOnly: true });
          res.cookie("refresh_token", result.refreshtoken, { httpOnly: true });
          return res.status(201).json({
            success: true,
            message: result.message,
            data: result.parent,
          });
        }
      } else res.status(400).json({ success: false, message: result.message });
    } catch (error) {
      next(error);
    }
  }

  /*..................................forgot password......................................*/
  async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { email } = req.body;

      const result = await this.ParentUseCase.verifyEmail(email);
      if (result.status) {
        req.session.pEmail = email;
        req.session.otp = result.otp;
        return res.status(200).json({
          success: true,
          message: "OTP send to your email, change password",
          changePassword: true,
        });
      } else {
        return res
          .status(400)
          .json({ success: false, message: result.message });
      }
    } catch (error) {
      next(error);
    }
  }

  /*.................................verify otp in forgot password..........................*/
  async verifyForgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { otp } = req.body;
      const sessionOtp = req.session.otp;

      if (otp !== sessionOtp) {
        return res.json({ success: false, message: "Incorrect OTP" });
      } else {
        return res.json({
          success: true,
          message: "OTP is verified, create a new password!",
        });
      }
    } catch (error) {
      next(error);
    }
  }

  /*.................................resend otp in forgot password...............................*/
  async resendforForgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const email = req.session.pEmail as string;
    console.log(req.session);
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "No email found in session." });
    }
    try {
      const result = await this.ParentUseCase.sendOtp(email);
      if (result.status) {
        req.session.otp = result.otp;
        return res.status(200).json({
          success: true,
          message: "OTP send to your email",
        });
      } else {
        return res.json({
          success: false,
          message: result.message,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  /*................................password saving....................................*/
  async passwordSaver(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { password } = req.body;
      const email = req.session.pEmail;
      if (!email) {
        return res
          .status(400)
          .json({ success: false, message: "No email found in session." });
      }
      const result = await this.ParentUseCase.savePassword(email, password);
      if (result.status) {
        return res.status(200).json({ success: true, message: result.message });
      } else {
        return res
          .status(400)
          .json({ success: false, message: result.message });
      }
    } catch (error) {
      next(error);
    }
  }

  /*.................................refresh accesstoken.........................................*/
  async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const refreshToken = req.cookies.refresh_token;
    console.log("inside controllr for accesstoken");

    if (!refreshToken)
      res
        .status(401)
        .json({ success: false, message: "Refresh Token Expired" });

    try {
      const decoded = verifyRefreshToken(refreshToken);

      if (!decoded || !decoded.id) {
        res
          .status(401)
          .json({ success: false, message: "Refresh Token Expired" });
      }

      const result = await this.ParentUseCase.findParentById(decoded.id);

      if (!result || !result.parent) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid Refresh Token" });
      }

      const parent = result.parent;

      if (!parent._id) {
        return res.status(400).json({
          success: false,
          message: "Invalid parent data, missing _id",
        });
      }

      const newAccessToken = jwtCreation(parent._id);
      res.cookie("access_token", newAccessToken);
      res.status(200).json({ success: true, message: "Token Updated" });
    } catch (error) {
      next(error);
    }
  }

  /*.................................................fetch data for profile.............................................*/
  async fetchData(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const userId = req.user?.id as string;

      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "User ID is missing" });
      }

      const result = await this.ParentUseCase.findParentById(userId);
      if (result.status) {
        const childData = await this.ParentUseCase.findChildData(userId);
        if (childData.status) {
          return res.status(200).json({
            success: true,
            message: result.message,
            data: result?.parent,
            child: childData.child,
          });
        }
        return res.status(200).json({
          success: true,
          message: result.message,
          data: result?.parent,
        });
      }

      res.status(400).json({ success: false, message: result.message });
    } catch (error) {
      next(error);
    }
  }

  /*................................................update profile..........................................*/
  async updateProfile(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const {
      name,
      email,
      image,
      phone,
      num,
      street,
      city,
      state,
      country,
      kids,
    } = req.body;
    const imageBuffer = req.file?.buffer;
    console.log(imageBuffer);

    try {
      let imageUrl: string | undefined;
      if (imageBuffer) {
        imageUrl = await uploadImage(imageBuffer, "calmnest");
      }

      const parentData: Partial<IParent> = {
        parentName: name,
        email,
        image: imageUrl,
        mobileNumber: phone,
        numberOfKids: num,
        street,
        city,
        state,
        country,
      };
      console.log("inside controller parentdata", parentData);
      console.log("inside route", kids);

      let parsedKids = Array.isArray(kids) ? kids : [];

      if (typeof kids === "string") {
        try {
          parsedKids = JSON.parse(kids);
        } catch (error) {
          return res
            .status(400)
            .json({ success: false, message: "Invalid kids data format" });
        }
      }
      console.log(parsedKids);

      const result = await this.ParentUseCase.addParentandKids(
        parentData as IParent,
        parsedKids
      );
      console.log("res", result);
      if (result.status)
        return res.status(201).json({
          success: true,
          message: "Parent and Childs added successfully",
          parent: result,
        });
      return res.json({ success: false, message: result.message });
    } catch (error) {
      console.error("Error updating profile:", error);
      return res.status(500).json({ error: "Error saving parent and kids" });
    }
  }

  /*.............................................remove child data...........................................*/
  async deleteChildData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const id = req.params.id;
    try {
      const result = await this.ParentUseCase.deleteKidById(id);
      if (!result.status)
        return res
          .status(404)
          .json({ success: false, message: result.message });

      return res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      next(error);
    }
  }

  /*...............................................changing password..........................................*/
  async changePassword(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const details = req.body;
    const userId = req.user?.id as string;
    try {
      const objectId = new mongoose.Types.ObjectId(userId);
      const exist = await this.ParentUseCase.verifyPassword(
        userId,
        details.oldPassword
      );
      if (!exist.status)
        return res.status(400).json({ success: false, message: exist.message });
      else {
        const result = await this.ParentUseCase.findParentwithIdandUpdate(
          userId,
          details.password
        );
        console.log(result, "controller");

        if (result.status)
          return res
            .status(200)
            .json({ success: true, message: "Updated Successfully" });
        else
          return res
            .status(400)
            .json({ success: false, message: result.message });
      }
    } catch (error) {
      next(error);
    }
  }

  /*.....................................fetch doctors........................................*/
  async fetchDoctorDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const doctorId = req.params.id;
    try {
      const result = await this.ParentUseCase.findDoctor(doctorId);
      if (result.status)
        return res.status(200).json({
          success: true,
          message: result.message,
          doctor: result.data,
          slots: result.slots,
        });
      return res.status(400).json({ success: false, message: result.message });
    } catch (error) {
      next(error);
    }
  }

  /*.................................................fetch child data.......................................*/
  async fetchChildData(req: AuthRequest, res: Response, next: NextFunction): Promise<void>{
    const userId = req.user?.id as string
    try{
      const result = await this.ParentUseCase.findChildData(userId);
      if (result.status) res.status(200).json({success: true, message: result.message, child: result.child});
      else res.status(400).json({success: false, message: result.message})
      }catch(error){
        next(error)
      }
    }

  /*...............................logout.................................*/
  async logoutUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
          return reject(
            res
              .status(500)
              .json({ success: false, message: "Failed to log out" })
          );
        }
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        return resolve(
          res
            .status(200)
            .json({ success: true, message: "Successfully logged out" })
        );
      });
    });
  }
}
