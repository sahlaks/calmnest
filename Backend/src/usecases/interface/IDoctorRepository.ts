import mongoose, { mongo } from "mongoose";
import IDoctor from "../../domain/entity/doctor";

export interface IDoctorRepository{
    findDoctorByEmail(email: string): Promise<IDoctor | null>;
    saveUserDetails(data: IDoctor): Promise<IDoctor | null>;
    updateDoctorDetails(email: string, password: string): Promise<IDoctor | null>;
    updateDoctorPassword(id: string, password: string): Promise<IDoctor | null>
    findDoctor(): Promise<IDoctor[] | null>
    findDetailsById(id: string): Promise< IDoctor | null>;
    findDoctorByIdandUpdate(id: string, update: object): Promise<IDoctor | null>
    findAndVerify(id: string): Promise<IDoctor | null>
    findAndDeleteById(id: string): Promise<IDoctor | null>
    saveDoctor(data: IDoctor): Promise<IDoctor | null>
}