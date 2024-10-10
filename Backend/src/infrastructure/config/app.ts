import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';

import parentRouter from '../routes/parentRoutes';
import doctorRouter from '../routes/doctorRoutes';
import adminRouter from '../routes/adminRoutes';
import doctorModel from '../databases/doctorModel';
import path from 'path';
import feedbackModel from '../databases/feedbackModel';



const createServer = () => {
  try {
    const app: express.Application = express()

    const corsOptions = {
      origin: 'http://localhost:3000',
      credentials: true,
      methods: 'GET,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type,Authorization',
    }

    // Apply CORS middleware
    app.use(cors(corsOptions))
    app.use(cookieParser())
    app.use(
      session({
        secret: 'your_secret_key',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
      })
    )
    
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use('/uploads', express.static(path.resolve(__dirname, '../../../uploads')));

    app.use('/api/parents',parentRouter)
    app.use('/api/doctor', doctorRouter)
    app.use('/api/admin', adminRouter)
    
    app.get('/api/fetch-doctors', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 6; 
        const search = req.query.search as string || '';
    
        const skip = (page - 1) * limit;
        const searchFilter = { ...search ? { doctorName: { $regex: search, $options: 'i' } } : {}, isVerified: true}

        const doctors = await doctorModel.find(searchFilter).skip(skip).limit(limit);
        const totalDoctors = await doctorModel.countDocuments();
        
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
        } else {
          res.status(404).json({
            success: false,
            message: 'No doctors found on this page'
          });
        }
      } catch (error) {
        next(error);
      }
    });
    
    app.get('/api/testimonials', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const testimonials = await feedbackModel.find().populate('parentId', 'parentName').exec();
        const shuffledTestimonials = testimonials.sort(() => 0.5 - Math.random());
        const randomTestimonials = shuffledTestimonials.slice(0, 3);
        res.status(200).json({
          success: true,
          data: randomTestimonials,
        });
      } catch (error) {
       next(error)
      }
    })

    app.get('/',(req: Request,res: Response)=>{
      console.log('welcome to homepage')
    })

    //error middleware
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      console.error(err.stack)
      res.status(500).send('Internal server error!')
    })
    return app
  } catch (error) {
    console.log(error)
  }
}

export default createServer