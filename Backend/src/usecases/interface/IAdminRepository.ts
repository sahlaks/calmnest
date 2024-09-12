import IAdmin from "../../domain/entity/admin";

export interface IAdminRepository{
    findAdminByEmail(email: string): Promise<IAdmin | null>
    
}