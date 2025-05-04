import { Request, Response } from 'express';
import User from '../models/user.model';
import AIGeneration from '../models/ai-generation.model';
import { openai } from '../config/openai.config';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Debug environment variables
console.log('Environment Variables:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'Present' : 'Missing'
});

export const generateText = async (req: Request, res: Response) => {
  try {
    const { prompt, wordLimit } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if user has enough credits
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.credits < 1) {
      return res.status(400).json({ message: 'Insufficient credits' });
    }

    // Generate text using Groq
    let generatedText: string;
    try {
      console.log('Making Groq API call...');
      const completion = await openai.chat.completions.create({
        messages: [
          { 
            role: "system", 
            content: `You are a helpful AI writing assistant.${wordLimit ? ` Please limit your response to approximately ${wordLimit} words.` : ''}` 
          },
          { role: "user", content: prompt }
        ],
        model: "llama-3.3-70b-versatile", // Using Groq's Llama 3.3 70B model
        temperature: 0.7,
        max_tokens: wordLimit ? Math.min(1000, wordLimit * 4) : 1000 // Rough estimate: 4 tokens per word
      });
      generatedText = completion.choices[0].message.content || '';
      console.log('Groq API call successful');
    } catch (error: any) {
      console.error('Groq API Error:', {
        message: error.message,
        code: error.code,
        type: error.type,
        status: error.status
      });
      return res.status(500).json({ 
        message: 'Error calling Groq API',
        error: {
          message: error.message,
          code: error.code,
          type: error.type
        }
      });
    }

    // Save the generation
    const generation = await AIGeneration.create({
      user: userId,
      prompt,
      result: generatedText,
      wordLimit: wordLimit || null
    });

    // Deduct credits
    user.credits -= 1;
    await user.save();

    res.status(200).json({
      message: 'Text generated successfully',
      result: generatedText,
      remainingCredits: user.credits,
      generationId: generation._id,
    });
  } catch (error) {
    console.error('Error generating text:', error);
    res.status(500).json({ message: 'Error generating text' });
  }
}; 