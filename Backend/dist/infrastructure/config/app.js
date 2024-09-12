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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const parentRoutes_1 = __importDefault(require("../routes/parentRoutes"));
const doctorRoutes_1 = __importDefault(require("../routes/doctorRoutes"));
const adminRoutes_1 = __importDefault(require("../routes/adminRoutes"));
const doctorModel_1 = __importDefault(require("../databases/doctorModel"));
const createServer = () => {
    try {
        const app = (0, express_1.default)();
        const corsOptions = {
            origin: 'http://localhost:3000',
            credentials: true,
            methods: 'GET,PUT,PATCH,POST,DELETE',
            allowedHeaders: 'Content-Type,Authorization',
        };
        // Apply CORS middleware
        app.use((0, cors_1.default)(corsOptions));
        app.use((0, cookie_parser_1.default)());
        app.use((0, express_session_1.default)({
            secret: 'your_secret_key',
            resave: false,
            saveUninitialized: true,
            cookie: { secure: false },
        }));
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use('/api/parents', parentRoutes_1.default);
        app.use('/api/doctor', doctorRoutes_1.default);
        app.use('/api/admin', adminRoutes_1.default);
        app.get('/api/fetch-doctors', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 6;
                const search = req.query.search || '';
                const skip = (page - 1) * limit;
                const searchFilter = Object.assign(Object.assign({}, search ? { doctorName: { $regex: search, $options: 'i' } } : {}), { isVerified: true });
                const doctors = yield doctorModel_1.default.find(searchFilter).skip(skip).limit(limit);
                const totalDoctors = yield doctorModel_1.default.countDocuments();
                const totalPages = Math.ceil(totalDoctors / limit);
                if (doctors.length > 0) {
                    res.status(200).json({
                        success: true,
                        message: 'Doctors fetched successfully',
                        data: {
                            doctors,
                            pagination: {
                                totalPages,
                                currentPage: page,
                                totalDoctors,
                                perPage: limit
                            }
                        }
                    });
                }
                else {
                    res.status(404).json({
                        success: false,
                        message: 'No doctors found on this page'
                    });
                }
            }
            catch (error) {
                next(error);
            }
        }));
        app.get('/', (req, res) => {
            console.log('welcome to homepage');
            res.send('Welcome to the homepage');
        });
        //error middleware
        app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).send('Internal server error!');
        });
        return app;
    }
    catch (error) {
        console.log(error);
    }
};
exports.default = createServer;
