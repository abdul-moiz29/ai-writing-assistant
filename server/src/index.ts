import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db';
import routes from './routes';
import { errorHandler, ApiError } from './middleware/errorHandler';
import './config/openai.config'; // Import OpenAI config

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());

// Handle raw webhook payloads before JSON parser
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

// Regular JSON parser for all other routes
app.use(express.json());

// API routes
app.use('/api', routes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to AI Writing Assistant API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      test: '/api/test'
    }
  });
});

// Error handling middleware
app.use(errorHandler);

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error: Error) => {
  console.error('Unhandled Rejection:', error);
  if (error instanceof ApiError) {
    // Don't exit for operational errors
    return;
  }
  process.exit(1);
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log('Environment Variables:', {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      GROQ_API_KEY: process.env.GROQ_API_KEY ? 'Set' : 'Missing'
    });
  });
}

export { app }; 