const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../../server');
const db = require('../../db');

describe('Authentication API Endpoint Tests', () => {
  describe('POST /register', () => {
    it('should create a new user and return a token', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'John Doe',
          email: 'johndoe@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
    });

    it('should return 400 for a bad request', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('POST /login', () => {
    it('should authenticate a user and return a token', async () => {
      const password = await bcrypt.hash('password123', 10);

      await db.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
        ['John Doe', 'johndoe@example.com', password]
      );

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'johndoe@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
    });

    it('should return 401 for invalid email or password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'johndoe@example.com',
          password: 'invalidpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid email or password');
    });
  });
});
