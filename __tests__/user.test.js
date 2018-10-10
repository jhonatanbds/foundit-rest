const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../config/express')();
const passport = require('../config/passport');
const mongo = require('../config/database');

const {
  models: { user: User }
} = app;

const login = (email, password) =>
  request(app)
    .post('/login')
    .send({
      email,
      password
    });

describe('CRUD /user/:id', () => {
  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI;
    passport();
    mongo(mongoUri || 'mongodb://localhost/road');
    await User.remove({}).exec();
  });

  afterAll((done) => {
    User.remove({})
      .exec()
      .then(() => {
        mongoose.disconnect(done);
      });
  });

  const user1 = {
    fullName: 'John Doe',
    birthDate: new Date(1997, 3, 3),
    email: 'john@mail.com',
    password: 'john123'
  };

  const user2 = {
    fullName: 'Joseph Doe',
    birthDate: new Date(1995, 9, 12),
    email: 'joseph@mail.com',
    password: 'joseph123'
  };

  test('should accept and add a valid new user', async () => {
    const response = await request(app)
      .post('/user')
      .send(user1);

    const response2 = await request(app)
      .post('/user')
      .send(user2);

    expect(response.status).toBe(200);
    expect(response2.status).toBe(200);
    user1._id = response.body._id;
    user2._id = response2.body._id;
  });

  test('should login with the first added user', async () => {
    const loginResponse = await login(user1.email, user1.password);
    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.token).toBeDefined();
    expect(loginResponse.body.fullName).toBe(user1.fullName);
    expect(loginResponse.body.email).toBe(user1.email);
  });

  test('should recover the first added user', async () => {
    const user = await User.findOne({ _id: user1._id }).exec();
    expect(user.fullName).toBe(user1.fullName);
  });

  test('should list the added users', async () => {
    const users = await User.find({}).exec();
    expect(users).toHaveLength(2);
  });

  test('should update the first added user', async () => {
    const userU = {
      fullName: 'John Doe Evans'
    };
    const loginRes = await login(user1.email, user1.password);
    expect(loginRes.status).toBe(200);
    const updatedUser = await request(app)
      .put('/user')
      .set('Authorization', `bearer ${loginRes.body.token}`)
      .send(userU);
    expect(updatedUser.statusCode).toBe(200);
    const getUser = await request(app)
      .get('/user')
      .set('Authorization', `bearer ${loginRes.body.token}`);
    expect(getUser.body[0].fullName).toBe(userU.fullName);
  });

  test('should delete the user', async () => {
    const loginRes = await login(user1.email, user1.password);
    const deleteRes = await request(app)
      .delete('/user')
      .set('Authorization', `bearer ${loginRes.body.token}`);
    expect(deleteRes.status).toBe(200);
    const users = await User.find({}).exec();
    expect(users).toHaveLength(1);
  });

  test(`should reject post without
        fullName, email or password`, () => {
    const badItems = [
      {
        birthDate: new Date(1997, 3, 3),
        email: 'john@mail.com',
        password: 'john123'
      },
      {
        fullName: 'John Doe',
        email: 'john@mail.com'
      },
      {
        fullName: 'John Doe',
        birthDate: new Date(1997, 3, 3),
        password: 'john123'
      },
      {
        _id: 'test1',
        createdAt: Date.now,
        fullName: 'John Doe',
        birthDate: new Date(1997, 3, 3),
        email: 'john@mail.com'
      }
    ];
    return Promise.all(badItems.map((badItem) =>
      request(app)
        .post('/user')
        .send(badItem)
        .then((res) => {
          expect(res.statusCode).toBe(500);
        })));
  });
});
