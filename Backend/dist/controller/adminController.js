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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
class AdminController {
    constructor(AdminUsecase) {
        this.AdminUsecase = AdminUsecase;
    }
    /*...........................................admin login..............................................*/
    adminLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const admin = yield this.AdminUsecase.findAdmin(email, password);
                if (!admin.status) {
                    return res.status(400).json({ success: false, message: 'Admin not found' });
                }
                res.cookie('access_token', admin.token, { httpOnly: true });
                res.json({ success: true, message: admin.message, data: admin.data });
            }
            catch (error) {
                console.error('Error during admin login:', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    /*.........................................parents data.......................................................*/
    fetchParents(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parents = yield this.AdminUsecase.collectParentData();
                if (parents)
                    return res.status(200).json({ success: true, message: parents.message, data: parents.data });
                else
                    return res.status(400).json({ success: false, message: 'No data available' });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*..........................................block a parent............................................*/
    blockAParent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const result = yield this.AdminUsecase.findParentAndBlock(id);
                if (result.status)
                    return res.status(201).json({ success: true, data: result.data });
                else
                    return res.status(400).json({ success: false, message: result.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*...........................................delete a parent.............................................*/
    deleteAParent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const result = yield this.AdminUsecase.findAndDelete(id);
                if (result.status)
                    return res.status(200).json({ success: true, message: result.message });
                return res.status(400).json({ success: false, message: result.message });
            }
            catch (err) {
                next(err);
            }
        });
    }
    /*................................................get all doctors....................................*/
    fetchdoctors(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doctor = yield this.AdminUsecase.collectDoctorData();
                if (doctor)
                    return res.status(200).json({ success: true, message: doctor.message, data: doctor.data });
                else
                    return res.status(400).json({ success: false, message: 'No data available' });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*...........................................block a doctor............................................*/
    blockDoctor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield this.AdminUsecase.findAndBlockDoctor(id);
                if (result.status)
                    return res.status(201).json({ success: true, data: result.data });
                else
                    return res.status(400).json({ success: false, message: result.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*........................................verify a doctor...............................*/
    verifyDoctor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield this.AdminUsecase.verifyDoctorwithId(id);
                if (result.status)
                    return res.status(201).json({ success: true, data: result.data });
                else
                    return res.status(400).json({ success: false, message: result.message });
            }
            catch (error) {
                res.status(500).json({ message: 'Error verifying doctor', error });
            }
        });
    }
    /*.................................................delete a doctor.......................................*/
    deleteDoctor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield this.AdminUsecase.deleteDoctorwithId(id);
                if (result.status)
                    return res.status(201).json({ success: true, data: result.data });
                else
                    return res.status(400).json({ success: false, message: result.message });
            }
            catch (error) {
                res.status(500).json({ message: 'Error verifying doctor', error });
            }
        });
    }
}
exports.AdminController = AdminController;
