import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => {
      console.log(`[${new Date().toISOString()}] MongoDB connected successfully.`);
    });

    mongoose.connection.on('error', (err) => {
      console.error(`[${new Date().toISOString()}] MongoDB connection error:`, err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn(`[${new Date().toISOString()}] MongoDB disconnected.`);
    });

    await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Failed to connect to MongoDB:`, error.message);
    process.exit(1);
  }
};

export default connectDB;