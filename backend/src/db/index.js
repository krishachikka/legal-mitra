import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        const connectInstance = await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`);
        console.log(`MongoDB Connected: DB_HOST - ${connectInstance.connection.host}`);
    } catch (error) {
        console.log('MongoDB connection Error:', error.message);
        process.exit(1);
    }
};

export default connectDB;
