import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(`${process.env.MONGODB_URI}/trackDocDB`);

    console.log('Database Connected ✅');

    // Optional: listen to connection events
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });
  } catch (error) {
    console.error('MongoDB connection failed', error.message);
  }
};

export default connectDB;
