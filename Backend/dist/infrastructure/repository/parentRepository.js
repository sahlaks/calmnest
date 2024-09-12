"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParentRepository = void 0;
const parentModel_1 = __importDefault(require("../databases/parentModel"));
class ParentRepository {
    /*..............................find user through email............................................*/
    findParentByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const parent = yield parentModel_1.default.findOne({ email }).exec();
            return parent;
        });
    }
    /*................................................save a user...................................................*/
    saveUserDetails(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedUser = yield parentModel_1.default.create(data);
                return savedUser;
            }
            catch (error) {
                console.error("Error in saveUserDetails:", error);
                return null;
            }
        });
    }
    /*.....................................saving user through google authentication.......................................*/
    saveUser(data, password, isGoogleSignUp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = new parentModel_1.default(Object.assign(Object.assign({}, data), { password,
                    isGoogleSignUp }));
                const parent = yield newUser.save();
                return parent;
            }
            catch (error) {
                console.error("Error saving user to database:", error);
                return null;
            }
        });
    }
    /*...............................................save new password......................................*/
    updateUserDetails(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const parent = yield parentModel_1.default.findOneAndUpdate({ email: email }, { $set: { password: password } }, { new: true });
            return parent;
        });
    }
    /*..........................................find a user throug ID........................................*/
    findDetailsById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const parent = yield parentModel_1.default.findById(id);
            return parent;
        });
    }
    /*..........................................update parent data........................................*/
    saveParent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parent = yield parentModel_1.default.findOneAndUpdate({ email: data.email }, data, { new: true, upsert: true });
                console.log('parent saved', parent);
                return parent;
            }
            catch (error) {
                console.error("Error updating parent:", error);
                return null;
            }
        });
    }
    /*.....................................find by id then update password..........................................*/
    updateParentPassword(id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const doctor = yield parentModel_1.default.findByIdAndUpdate({ _id: id }, { $set: { password: password } }, { new: true });
            return doctor;
        });
    }
    /*.................................................find whole data...........................................*/
    findParent() {
        return __awaiter(this, void 0, void 0, function* () {
            const parents = yield parentModel_1.default.find();
            return parents;
        });
    }
    /*....................................................find and update by blocking..................................*/
    findParentByIdandUpdate(id, update) {
        return __awaiter(this, void 0, void 0, function* () {
            const parent = yield parentModel_1.default.findByIdAndUpdate({ _id: id }, { $set: update }, { new: true });
            return parent;
        });
    }
    /*............................................find and delete..........................................*/
    findAndDeleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const parent = yield parentModel_1.default.findByIdAndDelete(id);
            return parent;
        });
    }
}
exports.ParentRepository = ParentRepository;
