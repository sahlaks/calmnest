import mongoose from 'mongoose'

export const connectDB = async (): Promise<void> => {
    try {
      const uri = process.env.MONGO_URI as string;
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 30000 });
      console.log('Database connected');
    } catch (error) {
      console.error('Error in connecting the database:', error);
    }
  };