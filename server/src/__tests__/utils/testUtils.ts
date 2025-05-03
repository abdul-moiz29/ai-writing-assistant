import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../../models/user.model';
import mongoose from 'mongoose';

// Ensure consistent JWT secret across tests
const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

export const createTestUser = async (userData: Partial<IUser> = {}): Promise<IUser> => {
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const defaultUser = {
    email: `test${randomSuffix}@example.com`,
    password: 'password123',
    name: 'Test User',
    credits: 10,
    ...userData
  };

  const user = new User(defaultUser);
  await user.save();
  return user;
};

export const getTestToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};

export const mockRequest = (body = {}, params = {}, headers = {}): Request => {
  return {
    body,
    params,
    headers,
    query: {},
  } as Request;
};

export const mockResponse = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

export const mockNext = (): NextFunction => {
  return jest.fn() as NextFunction;
};

// Clean up database after tests
export const cleanupDatabase = async () => {
  await User.deleteMany({});
};

// Close MongoDB connection
export const closeDatabase = async () => {
  await mongoose.connection.close();
}; 