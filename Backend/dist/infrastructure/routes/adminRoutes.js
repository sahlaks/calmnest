"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../../controller/adminController");
const adminUsecases_1 = require("../../usecases/adminUsecases");
const adminRepository_1 = require("../repository/adminRepository");
const parentRepository_1 = require("../repository/parentRepository");
const doctorRepository_1 = require("../repository/doctorRepository");
const adminRouter = express_1.default.Router();
const parentRepository = new parentRepository_1.ParentRepository();
const doctorRepository = new doctorRepository_1.DoctorRepository();
const adminRepository = new adminRepository_1.AdminRepository();
const adminUsecase = new adminUsecases_1.AdminUseCase(adminRepository, parentRepository, doctorRepository);
const controller = new adminController_1.AdminController(adminUsecase);
adminRouter.post('/admin-login', (req, res, next) => {
    controller.adminLogin(req, res, next);
});
adminRouter.get('/fetch-parents', (req, res, next) => {
    controller.fetchParents(req, res, next);
});
adminRouter.put('/block-parent/:id', (req, res, next) => {
    controller.blockAParent(req, res, next);
});
adminRouter.delete('/delete-parent/:id', (req, res, next) => {
    controller.deleteAParent(req, res, next);
});
adminRouter.get('/fetch-doctors', (req, res, next) => {
    controller.fetchdoctors(req, res, next);
});
adminRouter.put('/doctor/:id/block', (req, res, next) => {
    controller.blockDoctor(req, res, next);
});
adminRouter.post('/doctor/:id/verify', (req, res, next) => {
    controller.verifyDoctor(req, res, next);
});
adminRouter.delete('/doctor/:id/delete', (req, res, next) => {
    controller.deleteDoctor(req, res, next);
});
exports.default = adminRouter;
