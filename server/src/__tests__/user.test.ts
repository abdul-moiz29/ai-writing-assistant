import request from 'supertest';
import { app } from '../index';
import User from '../models/user.model';
import { createTestUser, getTestToken } from './utils/testUtils';

describe('User Routes', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('GET /api/users/me', () => {
    it('should get current user profile', async () => {
      const user = await createTestUser();
      const token = getTestToken(user._id.toString());

      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('email', user.email);
      expect(response.body).toHaveProperty('name', user.name);
      expect(response.body).toHaveProperty('credits', 10);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should not get profile without token', async () => {
      await request(app)
        .get('/api/users/me')
        .expect(401);
    });
  });

  describe('PATCH /api/users/credits', () => {
    it('should update user credits', async () => {
      const user = await createTestUser();
      const token = getTestToken(user._id.toString());

      const response = await request(app)
        .patch('/api/users/credits')
        .set('Authorization', `Bearer ${token}`)
        .send({ credits: 20 })
        .expect(200);

      expect(response.body).toHaveProperty('credits', 20);
      expect(response.body).toHaveProperty('email', user.email);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should not update credits with invalid value', async () => {
      const user = await createTestUser();
      const token = getTestToken(user._id.toString());

      const response = await request(app)
        .patch('/api/users/credits')
        .set('Authorization', `Bearer ${token}`)
        .send({ credits: -10 })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Invalid credits value');
    });

    it('should not update credits without token', async () => {
      await request(app)
        .patch('/api/users/credits')
        .send({ credits: 20 })
        .expect(401);
    });
  });
}); 