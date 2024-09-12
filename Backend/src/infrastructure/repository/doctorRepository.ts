import mongoose from "mongoose";
import IDoctor from "../../domain/entity/doctor";
import { IDoctorRepository } from "../../usecases/interface/IDoctorRepository";
import doctorModel from "../databases/doctorModel";

export class DoctorRepository implements IDoctorRepository{

    /*..........................................verify with email.............................................*/
    async findDoctorByEmail(email: string): Promise<IDoctor | null> {
        const doctor = await doctorModel.findOne({ email }).exec();
        return doctor;
    }

    /*...........................................save details..............................................*/
    async saveUserDetails(data: IDoctor): Promise<IDoctor | null> {
        try {
            const savedUser = await doctorModel.create(data);
            return savedUser;
        } catch (error) {
            console.error('Error in save doctor details:', error);
            return null;
        }
    }

    /*.........................................update password with email.................................................*/
    async updateDoctorDetails(email: string, password: string): Promise<IDoctor | null> {
        const doctor = await doctorModel.findOneAndUpdate({email: email},{$set: {password: password}},{new: true})
        return doctor;
    }

    /*............................................find by ID...................................................*/
    async findDoctorById(id: mongoose.Types.ObjectId): Promise<IDoctor | null> {
        try{
            const doctor = await doctorModel.findById(id)
            return doctor
        } catch(error){
            console.error('Error in find doctor details:', error);
            return null;
        }
    }

    /*.....................................find by id then update password..........................................*/
    async updateDoctorPassword(id: string, password: string): Promise<IDoctor | null> {
        const doctor = await doctorModel.findByIdAndUpdate({_id: id},{$set: {password: password}},{new: true})
        return doctor
    }

    /*........................................find all doctors.........................................*/
    async findDoctor(): Promise<IDoctor[] | null> {
        const doctors = await doctorModel.find()
        return doctors
    }

    /*................................................find by Id.................................................*/
    async findDetailsById(id: string): Promise<IDoctor | null> {
        const doctor = await doctorModel.findById(id);
        return doctor;
    }

    /*...............................................find by Id and then block......................................*/
    async findDoctorByIdandUpdate(id: string, update: object): Promise<IDoctor | null> {
        const doctor = await doctorModel.findByIdAndUpdate({_id: id},{$set: update},{new: true})
        return doctor
    }

    /*..............................................find with Id and verify a doctor.....................................*/
    async findAndVerify(id: string): Promise<IDoctor | null> {
        const doctor = await doctorModel.findByIdAndUpdate({_id: id},{$set: {isVerified: true}},{new: true})
        return doctor
    }

    /*........................................find and delete a doctor.........................................*/
    async findAndDeleteById(id: string): Promise<IDoctor | null> {
        const doctor = await doctorModel.findByIdAndDelete(id)
        return doctor
    }

    /*........................................save updates....................................*/
    async saveDoctor(data: IDoctor): Promise<IDoctor | null> {
        try {
            const doctor = await doctorModel.findOneAndUpdate(
              { email: data.email },
              data,
              { new: true, upsert: true }
            );
            return doctor;
          } catch (error) {
            console.error("Error updating doctor", error);
            return null;
          }
        }
}
