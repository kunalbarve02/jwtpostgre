const request = require('supertest')
const app = require('../../server') 
const db = require('../../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

let testUser,token

beforeAll(async () => {
  const newUser = {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'password123'
  }

  newUser.password = await bcrypt.hash(newUser.password, 10)

  const result = await db.query(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
    [newUser.name, newUser.email, newUser.password]
  )

  testUser = result.rows[0]

  token = await jwt.sign({id: testUser.id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })

})

afterAll(async () => {
  await db.query('DELETE FROM users WHERE id = $1', [testUser.id])
})

describe('User API Endpoint Tests', () => {
  describe('GET /users', () => {
    it('should retrieve all users', async () => {
      const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body.data).toBeInstanceOf(Array)
    })

  })

  describe('GET /users/:id', () => {
    it('should retrieve a user by ID', async () => {
      const response = await request(app)
      .get(`/users/${testUser.id}`)
      .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body.data).toBeDefined()
      expect(response.body.data.id).toBe(testUser.id)
    })

    it('should return 404 if user not found', async () => {
      const response = await request(app)
      .get('/users/999')
      .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(404)
      expect(response.text).toBe('User not found!')
    })
  })

  describe('PUT /users/:id', () => {
    it('should edit a user', async () => {
      const updatedUser = {
        name: 'Updated Name',
        email: 'updated@example.com'
      }

      const response = await request(app)
        .put(`/users/${testUser.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedUser)

      expect(response.status).toBe(200)
      expect(response.body.data).toBeDefined()
      expect(response.body.data.name).toBe(updatedUser.name)
      expect(response.body.data.email).toBe(updatedUser.email)
    })

    it('should return 404 if user not found', async () => {
      const updatedUser = {
        name: 'Updated Name',
        email: 'updated@example.com'
      }

      const response = await request(app)
        .put('/users/999')
        .set('Authorization', `Bearer ${token}`)
        .send(updatedUser)

      expect(response.status).toBe(404)
      expect(response.text).toBe('User not found!')
    })
  })

  describe('DELETE /users/:id', () => {
    it('should delete a user', async () => {
      const response = await request(app)
      .delete(`/users/${testUser.id}`)
      .set('Authorization', `Bearer ${token}`)


      expect(response.status).toBe(204)
      expect(response.text).toBe('')
    })

    it('should return 404 if user not found', async () => {
      const response = await request(app)
      .delete('/users/999')
      .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(404)
      expect(response.text).toBe('User not found!')
    })
  })
})
