const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../config/express')();
const passport = require('../config/passport');
const mongo = require('../config/database');

const {
  models: { item: Item }
} = app;

describe('CRUD /item/:id', () => {
  let token;

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI;
    passport();
    mongo(mongoUri || 'mongodb://localhost/road');
    const response1 = await request(app)
      .post('/user')
      .send({
        fullName: 'Admin Example',
        birthDate: new Date(1997, 3, 3),
        email: 'admin@mail.com',
        password: 'eutenhoumviolaorosa'
      });
    const response = await request(app)
      .post('/login')
      .send({
        email: 'admin@mail.com',
        password: 'eutenhoumviolaorosa'
      });
    token = response.body.token; // eslint-disable-line
    await Item.remove({}).exec();
  });

  afterAll((done) => {
    Item.remove({})
      .exec()
      .then(() => {
        mongoose.disconnect(done);
      });
  });

  const item = {
    title: 'Chave de carro',
    foundDate: new Date(2018, 3, 3),
    foundBy: token,
    foundPlace: 'CN',
    description: 'tavo andano, achei no chão'
  };

  const item2 = {
    title: "Garrafa d'agua",
    foundDate: new Date(2018, 3, 3),
    foundBy: token,
    foundPlace: 'LCC',
    description: 'tavo andano, achei no chão'
  };

  let itemId;

  test('should accept and add a valid new item', async () => {
    const response = await request(app)
      .post('/item')
      .set('Authorization', `bearer ${token}`)
      .send(item);

    const response2 = await request(app)
      .post('/item')
      .set('Authorization', `bearer ${token}`)
      .send(item2);

    expect(response.status).toBe(200);
    expect(response2.status).toBe(200);
    itemId = response.body._id;
  });

  test('should recover the first added item', async () => {
    const response = await request(app)
      .get(`/item/${itemId}`)
      .set('Authorization', `bearer ${token}`);

    console.log(response.status);
    expect(response.body.title).toBe(item.title);
    expect(response.body.foundDate).toBe(item.foundDate);
    expect(response.body.foundPlace).toBe(item.foundPlace);
    expect(response.body.description).toBe(item.description);
  });

  test('should list the added items', async () => {
    const response = await request(app)
      .get('/item')
      .set('Authorization', `bearer ${token}`);
    expect(response.body).toHaveLength(2);
  });

  test('should update the first added item', async () => {
    const itemU = {
      title: 'Chave de casa'
    };
    const updatedItem = await request(app)
      .put(`/item/${itemId}`)
      .set('Authorization', `bearer ${token}`)
      .send(itemU);
    expect(updatedItem.statusCode).toBe(200);
    const response = await request(app)
      .get(`/item/${itemId}`)
      .set('Authorization', `bearer ${token}`);
    expect(response.body.title).toBe(itemU.title);
  });

  test('should delete the item', async () => {
    const deleteRes = await request(app)
      .delete(`/item/${itemId}`)
      .set('Authorization', `bearer ${token}`);
    expect(deleteRes.status).toBe(200);
    const response = await request(app)
      .get('/item')
      .set('Authorization', `bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).not.toContain(item);
  });

  // test('should reject post without brand, model, year, plate, odometer', () => {
  //   const badItems = [
  //     {
  //       brand: 'Volkswagen',
  //       model: 'Gol',
  //       year: '2018',
  //       plate: 'XXX-9999'
  //     },
  //     {
  //       model: 'Gol',
  //       year: '2018',
  //       odometer: 0
  //     },
  //     {
  //       brand: 'Volkswagen',
  //       model: 'Gol',
  //       odometer: 0
  //     }
  //   ];
  //   return Promise.all(badItems.map((badItem) =>
  //     request(app)
  //       .post('/item')
  //       .set('Authorization', `bearer ${token}`)
  //       .send(badItem)
  //       .then((res) => {
  //         expect(res.statusCode).toBe(500);
  //       })));
  // });
});