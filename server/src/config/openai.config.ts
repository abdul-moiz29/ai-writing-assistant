import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('Initializing Groq client...');

// Initialize Groq client
export const openai = new OpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
  defaultHeaders: {
    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
  }
});

console.log('Groq client initialized successfully'); 