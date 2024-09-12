import IAdmin from "../../domain/entity/admin";
import { IAdminRepository } from "../../usecases/interface/IAdminRepository";
import adminModel from "../databases/adminModel";

export class AdminRepository implements IAdminRepository{

    /*...............................................find with email.............................................*/
    async findAdminByEmail(email: string): Promise<IAdmin | null> {
        const admin = await adminModel.findOne({email})
            return admin;
    }
}