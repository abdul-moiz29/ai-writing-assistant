import request from 'supertest';
import { app } from '../index';
import User, { IUser } from '../models/user.model';
import { createTestUser, getTestToken } from './utils/testUtils';

describe('Authentication Routes', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new user', async () => {
      const userData = {
        email: `test${Math.random().toString(36).substring(2, 8)}@example.com`,
        password: 'password123',
        name: 'Test User'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', userData.email);
      expect(response.body.user).toHaveProperty('name', userData.name);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should not create a user with existing email', async () => {
      const user = await createTestUser();

      const userData = {
        email: user.email,
        password: 'password123',
        name: 'Test User'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Email already registered');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with correct credentials', async () => {
      const user = await createTestUser();

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: 'password123'
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', user.email);
    });

    it('should not login with incorrect password', async () => {
      const user = await createTestUser();

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Invalid email or password');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should get current user with valid token', async () => {
      const user = await createTestUser();
      const token = getTestToken(user._id.toString());

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('email', user.email);
      expect(response.body).toHaveProperty('name', user.name);
    });

    it('should not get current user without token', async () => {
      await request(app)
        .get('/api/auth/me')
        .expect(401);
    });
  });
}); 