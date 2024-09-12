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
exports.AdminUseCase = void 0;
const JwtCreation_1 = require("../infrastructure/services/JwtCreation");
const bcrypt_1 = __importDefault(require("bcrypt"));
class AdminUseCase {
    constructor(adminRepository, parentRepository, doctorRepository) {
        this.adminRepository = adminRepository;
        this.parentRepository = parentRepository;
        this.doctorRepository = doctorRepository;
    }
    /*..............................................find admin...................................................*/
    findAdmin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const exist = yield this.adminRepository.findAdminByEmail(email);
            if (exist) {
                const isMatch = yield bcrypt_1.default.compare(password, exist.password);
                if (!isMatch) {
                    return { status: false, message: 'Invalid credentials' };
                }
                const accessToken = (0, JwtCreation_1.jwtCreation)(exist._id);
                return { status: true, message: 'Admin logged successfully', data: exist, token: accessToken };
            }
            else {
                return { status: false, message: 'Admin not exists!' };
            }
        });
    }
    /*.......................................collect parent data.........................................*/
    collectParentData() {
        return __awaiter(this, void 0, void 0, function* () {
            const parent = yield this.parentRepository.findParent();
            if (parent) {
                return { status: true, message: 'Fetch data', data: parent };
            }
            return { status: false, message: 'No data' };
        });
    }
    /*..........................................find parent by id and block..........................................*/
    findParentAndBlock(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const parent = yield this.parentRepository.findDetailsById(id);
            if (parent) {
                const updated = yield this.parentRepository.findParentByIdandUpdate(id, { isBlocked: !parent.isBlocked });
                if (updated) {
                    const message = updated.isBlocked ? 'User blocked' : 'User unblocked';
                    return { status: true, message, data: updated };
                }
            }
            return { status: false, message: 'User does not exist' };
        });
    }
    /*........................................find and delete parent..................................*/
    findAndDelete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const parent = yield this.parentRepository.findAndDeleteById(id);
            if (!parent)
                return { status: false, message: 'Parent not found' };
            return { status: true, message: 'Parent deleted successfully!' };
        });
    }
    /*.............................................collect doctor data...........................................*/
    collectDoctorData() {
        return __awaiter(this, void 0, void 0, function* () {
            const doctor = yield this.doctorRepository.findDoctor();
            if (doctor) {
                return { status: true, message: 'Fetch data', data: doctor };
            }
            return { status: false, message: 'No data' };
        });
    }
    /*..........................................find doctor and block.................................*/
    findAndBlockDoctor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield this.doctorRepository.findDetailsById(id);
            if (doc) {
                const updated = yield this.doctorRepository.findDoctorByIdandUpdate(id, { isBlocked: !doc.isBlocked });
                if (updated) {
                    const message = updated.isBlocked ? 'Doctor blocked' : 'Doctor unblocked';
                    return { status: true, message, data: updated };
                }
            }
            return { status: false, message: 'Doctor does not exist' };
        });
    }
    /*......................................find doctor and verify..................................*/
    verifyDoctorwithId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield this.doctorRepository.findDetailsById(id);
            if (doc) {
                const updated = yield this.doctorRepository.findAndVerify(id);
                if (updated) {
                    return { status: true, message: 'Doctor is verified', data: updated };
                }
            }
            return { status: false, message: 'Doctor does not exist' };
        });
    }
    /*...........................................find and delete a doctor........................................*/
    deleteDoctorwithId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield this.doctorRepository.findAndDeleteById(id);
            if (!doc)
                return { status: false, message: 'Doctor not found' };
            return { status: true, message: 'Doctor deleted successfully!' };
        });
    }
}
exports.AdminUseCase = AdminUseCase;
