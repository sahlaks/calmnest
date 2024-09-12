import { Request, Response, NextFunction } from "express";
import { AdminUseCase } from "../usecases/adminUsecases";

export class AdminController{
    constructor( private AdminUsecase: AdminUseCase) {}

    /*...........................................admin login..............................................*/
    async adminLogin(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try{
        const {email, password} = req.body;
        const admin = await this.AdminUsecase.findAdmin(email,password);

        if(!admin.status){
            return res.status(400).json({ success: false,  message: 'Admin not found' });
        }
        res.cookie('access_token',admin.token,{httpOnly: true})
        res.json({ success: true, message: admin.message, data: admin.data });
        } catch (error) {
            console.error('Error during admin login:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }


    /*.........................................parents data.......................................................*/
    async fetchParents(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
        try{
            const parents = await this.AdminUsecase.collectParentData();
            if(parents) return res.status(200).json({success: true, message: parents.message, data: parents.data});
            else return res.status(400).json({success: false, message: 'No data available'})
          } catch (error) {
            next(error);
          }
        }

    /*..........................................block a parent............................................*/
    async blockAParent(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
        const id = req.params.id;
        try{
            const result = await this.AdminUsecase.findParentAndBlock(id)
            if (result.status) return res.status(201).json({ success: true, data: result.data });
            else return res.status(400).json({ success: false, message: result.message });
        } catch(error){
            next(error)
        }
    }

    /*...........................................delete a parent.............................................*/
    async deleteAParent(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
       const id = req.params.id
       try{
        const result = await this.AdminUsecase.findAndDelete(id)
        if(result.status) return res.status(200).json({success: true, message: result.message})
        return res.status(400).json({success: false, message: result.message})
       } catch(err){
        next(err)
       }
    }

    /*................................................get all doctors....................................*/
    async fetchdoctors(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
        try{
        const doctor = await this.AdminUsecase.collectDoctorData();
        if(doctor) return res.status(200).json({success: true, message: doctor.message, data: doctor.data});
        else return res.status(400).json({success: false, message: 'No data available'})
      } catch (error) {
        next(error);
      }
    }

    /*...........................................block a doctor............................................*/
    async blockDoctor(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
        try {
          const { id } = req.params;
          const result = await this.AdminUsecase.findAndBlockDoctor(id);
          if (result.status) return res.status(201).json({ success: true, data: result.data });
          else return res.status(400).json({ success: false, message: result.message });
      } catch(error){
          next(error)
      }
    }

    /*........................................verify a doctor...............................*/
    async verifyDoctor(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
    try {
        const { id } = req.params;
        const result = await this.AdminUsecase.verifyDoctorwithId(id);
        if (result.status) return res.status(201).json({ success: true, data: result.data });
        else return res.status(400).json({ success: false, message: result.message });
      } catch (error) {
        res.status(500).json({ message: 'Error verifying doctor', error });
      }
    }

    /*.................................................delete a doctor.......................................*/
    async deleteDoctor(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
        try{
            const { id } = req.params;
            const result = await this.AdminUsecase.deleteDoctorwithId(id);
            if (result.status) return res.status(201).json({ success: true, data: result.data });
            else return res.status(400).json({ success: false, message: result.message });
          } catch (error) {
            res.status(500).json({ message: 'Error verifying doctor', error });
          }
        }
    
}