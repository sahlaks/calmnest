import IParent from "../../domain/entity/Parents";
import parentModel from "../databases/parentModel";
import { IParentRepository } from "../../usecases/interface/IParentRepository";
import IChild from "../../domain/entity/Child";
import childModel from "../databases/childModel";

export class ParentRepository implements IParentRepository {
  /*..............................find user through email............................................*/
  async findParentByEmail(email: string): Promise<IParent | null> {
    const parent = await parentModel.findOne({ email }).exec();
    return parent;
  }

  /*................................................save a user...................................................*/
  async saveUserDetails(data: IParent): Promise<IParent | null> {
    try {
      const savedUser = await parentModel.create(data);
      return savedUser;
    } catch (error) {
      console.error("Error in saveUserDetails:", error);
      return null;
    }
  }

  /*.....................................saving user through google authentication.......................................*/
  async saveUser(
    data: IParent,
    password: string,
    isGoogleSignUp: boolean
  ): Promise<IParent | null> {
    try {
      const newUser = new parentModel({
        ...data,
        password,
        isGoogleSignUp,
      });
      const parent = await newUser.save();
      return parent;
    } catch (error) {
      console.error("Error saving user to database:", error);
      return null;
    }
  }

  /*...............................................save new password......................................*/
  async updateUserDetails(
    email: string,
    password: string
  ): Promise<IParent | null> {
    const parent = await parentModel.findOneAndUpdate(
      { email: email },
      { $set: { password: password } },
      { new: true }
    );
    return parent;
  }

  /*..........................................find a user throug ID........................................*/
  async findDetailsById(id: string): Promise<IParent | null> {
    const parent = await parentModel.findById(id);
    return parent;
  }

  /*..........................................update parent data........................................*/
  async saveParent(data: IParent): Promise<IParent | null> {
    try {
      const parent = await parentModel.findOneAndUpdate(
        { email: data.email },
        data,
        { new: true, upsert: true }
      );
      console.log('parent saved',parent);
      
      return parent;
    } catch (error) {
      console.error("Error updating parent:", error);
      return null;
    }
  }

 /*.....................................find by id then update password..........................................*/
 async updateParentPassword(id: string, password: string): Promise<IParent | null> {
  const doctor = await parentModel.findByIdAndUpdate({_id: id},{$set: {password: password}},{new: true})
  return doctor
}

/*.................................................find whole data...........................................*/
async findParent(): Promise<IParent[] | null> {
  const parents = await parentModel.find()
  return parents
}

/*....................................................find and update by blocking..................................*/
async findParentByIdandUpdate(id: string, update: object): Promise<IParent | null> {
  const parent = await parentModel.findByIdAndUpdate({_id: id},{$set: update},{new: true})
  return parent
}

/*............................................find and delete..........................................*/
async findAndDeleteById(id: string): Promise<IParent | null> {
  const parent = await parentModel.findByIdAndDelete(id)
  return parent
}





}
