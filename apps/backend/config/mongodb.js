import mongoose from 'mongoose';

// Prevent multiple connections in Vercel Serverless Functions
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    console.info(`[${new Date().toISOString()}] Using cached MongoDB connection.`);
    return cached.conn;
  }

  if (!cached.promise) {
    const uri = `${process.env.MONGODB_URI}/e-commerce`;
    
    mongoose.connection.on('connected', () => {
      console.info(`[${new Date().toISOString()}] MongoDB connected successfully.`);
    });

    mongoose.connection.on('error', (err) => {
      console.error(`[${new Date().toISOString()}] MongoDB connection error:`, err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn(`[${new Date().toISOString()}] MongoDB disconnected.`);
    });

    // Use standard defaults, removing aggressive 5000ms timeouts
    // which cause random 500 FUNCTION_INVOCATION_FAILED on cold starts.
    cached.promise = mongoose.connect(uri).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error(`[${new Date().toISOString()}] Failed to connect to MongoDB:`, error.message);
    throw error; // Let the application catch the error without killing the process
  }
};

export default connectDB;