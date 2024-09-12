import IChild from "../../domain/entity/Child";
import IParent from "../../domain/entity/Parents";

export interface IParentRepository {
    findParentByEmail(email: string): Promise<IParent | null>;
    saveUserDetails(data: IParent): Promise<IParent | null>;
    saveUser(data: IParent, password: string, isGoogleSignUp: boolean): Promise<IParent | null>
    updateUserDetails(email: string, password: string): Promise<IParent | null>;
    findDetailsById(id: string): Promise< IParent | null>;
    saveParent(data: IParent): Promise<IParent | null>;
    updateParentPassword(id: string, password: string): Promise<IParent | null>
    findParent(): Promise<IParent[] | null>
    findParentByIdandUpdate(id: string, update: object): Promise<IParent | null>
    findAndDeleteById(id: string): Promise<IParent | null>
}