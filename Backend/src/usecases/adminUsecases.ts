import IAdmin from "../domain/entity/admin";
import IParent from "../domain/entity/Parents";
import { jwtCreation } from "../infrastructure/services/JwtCreation";
import { IAdminRepository } from "./interface/IAdminRepository";
import bcrypt from 'bcrypt';
import { IParentRepository } from "./interface/IParentRepository";
import { log } from "util";
import { bool } from "aws-sdk/clients/signer";
import { IDoctorRepository } from "./interface/IDoctorRepository";
import IDoctor from "../domain/entity/doctor";

export class AdminUseCase {
    private adminRepository: IAdminRepository;
    private parentRepository: IParentRepository;
    private doctorRepository: IDoctorRepository;
  
    constructor(adminRepository: IAdminRepository, parentRepository: IParentRepository, doctorRepository: IDoctorRepository) {
      this.adminRepository = adminRepository;
      this.parentRepository = parentRepository;
      this.doctorRepository = doctorRepository
    }

    /*..............................................find admin...................................................*/
    async findAdmin(email: string, password: string): Promise<{status: boolean, message?: string, data?: IAdmin, token?: string}> {
        const exist = await this.adminRepository.findAdminByEmail(email);
        if(exist){
            const isMatch = await bcrypt.compare(password, exist.password);
            if (!isMatch) {
                return { status: false, message: 'Invalid credentials'}
            }
            const accessToken = jwtCreation(exist._id)
            return { status: true, message: 'Admin logged successfully', data: exist, token: accessToken}
        } else {
            return {status: false, message: 'Admin not exists!'}
        }
    }

    /*.......................................collect parent data.........................................*/
    async collectParentData(): Promise<{status: boolean, message?: string, data?: IParent[]}> {
        const parent = await this.parentRepository.findParent()
        if(parent){
            return {status: true, message: 'Fetch data', data: parent}
        }
        return {status: false, message: 'No data'}
    }

    /*..........................................find parent by id and block..........................................*/
    async findParentAndBlock(id: string): Promise<{status: boolean; message?: string; data?: IParent}> {
        const parent = await this.parentRepository.findDetailsById(id)
        if(parent){
            const updated = await this.parentRepository.findParentByIdandUpdate(id,{isBlocked: !parent.isBlocked})
            if(updated){
                const message = updated.isBlocked ? 'User blocked' : 'User unblocked';
                return { status: true, message, data: updated };
            }
        }
        return { status: false, message: 'User does not exist' };
    }

    /*........................................find and delete parent..................................*/
    async findAndDelete(id: string): Promise<{status: boolean; message?: string}>{
        const parent = await this.parentRepository.findAndDeleteById(id)
        if(!parent) return { status: false, message: 'Parent not found' };
        return {status: true, message: 'Parent deleted successfully!'}
    }

    /*.............................................collect doctor data...........................................*/
    async collectDoctorData(): Promise<{status: boolean, message?: string, data?: IDoctor[]}> {
        const doctor = await this.doctorRepository.findDoctor()
        if(doctor){
            return {status: true, message: 'Fetch data', data: doctor}
        }
        return {status: false, message: 'No data'}
    } 

    /*..........................................find doctor and block.................................*/
    async findAndBlockDoctor(id: string): Promise<{status: boolean; message?: string; data?: IDoctor}> {
        const doc = await this.doctorRepository.findDetailsById(id)
        if(doc){
            const updated = await this.doctorRepository.findDoctorByIdandUpdate(id,{isBlocked: !doc.isBlocked})
            if(updated){
                const message = updated.isBlocked ? 'Doctor blocked' : 'Doctor unblocked';
                return { status: true, message, data: updated };
            }
        }
        return { status: false, message: 'Doctor does not exist' };
    }

    /*......................................find doctor and verify..................................*/
    async verifyDoctorwithId (id: string): Promise<{status: boolean; message?: string; data?: IDoctor}> {
        const doc = await this.doctorRepository.findDetailsById(id)
        if(doc){
            const updated = await this.doctorRepository.findAndVerify(id)
            if(updated){
                
                return { status: true, message: 'Doctor is verified', data:updated };
            }
        }
        return { status: false, message: 'Doctor does not exist' };
    }

    /*...........................................find and delete a doctor........................................*/
    async deleteDoctorwithId (id: string): Promise<{status: boolean; message?: string; data?: IDoctor}> {
        const doc = await this.doctorRepository.findAndDeleteById(id)
        if(!doc) return { status: false, message: 'Doctor not found' };
        return {status: true, message: 'Doctor deleted successfully!'}
    }

}