const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../config/express')();
const passport = require('../config/passport');
const mongo = require('../config/database');

const User = app.user.model;

describe('auth', () => {
  let token;

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI;
    passport();
    mongo(mongoUri || 'mongodb://localhost/foundit');
    await User.remove({}).exec();
    await request(app)
      .post('/user')
      .send({
        fullName: 'Admin Example',
        birthDate: new Date(1997, 3, 3),
        email: 'admin@email.com',
        password: 'eutenhoumviolaorosa'
      });
  });

  afterAll((done) => {
    User.remove({})
      .exec()
      .then(() => {
        mongoose.disconnect(done);
      });
  });

  test('Test login with valid credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'admin@email.com',
        password: 'eutenhoumviolaorosa'
      });
    expect(response.status).toBe(200);
    const user = response.body;
    expect(user).toBeDefined();
    expect(user).toHaveProperty('token');
    expect(user.token).toBeDefined();
    expect(user.token).not.toBe('');
    token = user.token; // eslint-disable-line
  });

  test('Test logout', async () => {
    const response = await request(app)
      .post('/logout')
      .set('Authorization', `bearer ${token}`);
    expect(response.status).toBe(200);
  });
});
