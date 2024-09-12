import { Request, Response, NextFunction } from "express";
import {
  verifyAccessToken,
  verifyRefreshToken,
} from "../services/tokenVerification";
import { ParentRepository } from "../repository/parentRepository";
import { DoctorRepository } from "../repository/doctorRepository";

interface AuthRequest extends Request {
  user?: { id: string };
}

/*.................................for parent............................................*/
export const validateTokens = (parentRepository: ParentRepository) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies.access_token;
      const refreshToken = req.cookies.refresh_token;

      if (!refreshToken)
        res.status(401).json({ message: "Refresh Token Expired" });

      const refreshTokenValid = verifyRefreshToken(refreshToken);
      console.log(refreshTokenValid);

      const user = await parentRepository.findDetailsById(refreshTokenValid.id);
      console.log(user);

      if (!refreshTokenValid.id || !user) {
        res
          .status(401)
          .json({ success: false, message: "Refresh Token Expired" });
      }

      if (!accessToken) {
        res.status(401).json({success: false, message: "Access Token Expired" });
      } else {
        const decoded = verifyAccessToken(accessToken);

        if (!decoded.id || !decoded) {
          res.status(401).json({ success: false, message: "Access Token Expired" });
        } else {
            const existingUser = await parentRepository.findDetailsById(decoded.id);
            if (!existingUser) {
              res.status(404).json({ message: "User not found" });
            }
            req.user = {id: refreshTokenValid.id}

            next();
        }
      }
    } catch (err) {}
  };
};



/*..........................................for doctor validation.................................*/
export const validateDoctorTokens = (doctorRepository: DoctorRepository) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies.doc_auth_token;
      const refreshToken = req.cookies.doc_refresh_token;

      if (!refreshToken)
        res.status(401).json({ message: "Refresh Token Expired" });

      const refreshTokenValid = verifyRefreshToken(refreshToken);
      console.log(refreshTokenValid);

      const user = await doctorRepository.findDetailsById(refreshTokenValid.id);
      console.log(user);

      if (!refreshTokenValid.id || !user) {
        res
          .status(401)
          .json({ success: false, message: "Refresh Token Expired" });
      }

      if (!accessToken) {
        res.status(401).json({success: false, message: "Access Token Expired" });
      } else {
        const decoded = verifyAccessToken(accessToken);

        if (!decoded.id || !decoded) {
          res.status(401).json({ success: false, message: "Access Token Expired" });
        } else {
            const existingUser = await doctorRepository.findDetailsById(decoded.id);
            if (!existingUser) {
              res.status(404).json({ message: "User not found" });
            }
            req.user = {id: refreshTokenValid.id}

            next();
        }
      }
    } catch (err) {}
  };
};
