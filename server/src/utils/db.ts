import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Skip connection in test environment
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-writing-assistant';
    
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

export default connectDB; 