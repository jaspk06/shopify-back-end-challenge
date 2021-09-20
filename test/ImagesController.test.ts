import { expect } from 'chai';
import app from '../src/app';
import { agent as request } from 'supertest';

let token: string, userId: string; const imageIds: Array<string> = [];

it('should POST /user/register and register a new user', async function () {
  const res = await request(app)
    .post('/user/register').send({
      first_name: 'Jason',
      last_name: 'Liu',
      email: 'imagestest@gmail.com',
      password: 'password'
    });

  token = res.body.token;
  userId = res.body.id;
  expect(res.status).to.equal(201);
  expect(res.body).to.be.an('object');
});

it('upload 1 image file', async function () {
  const res = await request(app).post(`/images/${userId}`)
    .set('x-access-token', token)
    .attach('image', 'images/alex-seinet-8dmtbpJJJ7k-unsplash.jpg');

  expect(res.status).to.equal(200);
});

it('upload 3 image files', async function () {
  const res = await request(app).post(`/images/${userId}`)
    .set('x-access-token', token)
    .attach('image', 'images/alex-seinet-8dmtbpJJJ7k-unsplash.jpg')
    .attach('image', 'images/chad-madden-22u9dunCITQ-unsplash.jpg')
    .attach('image', 'images/christian-bowen-3JqVQsShG28-unsplash.jpg');

  for (const image of res.body.images) {
    imageIds.push(image.public_id);
  }

  expect(res.status).to.equal(200);
});

it('upload 10 image files', async function () {
  const res = await request(app).post(`/images/${userId}`)
    .set('x-access-token', token)
    .attach('image', 'images/alex-seinet-8dmtbpJJJ7k-unsplash.jpg')
    .attach('image', 'images/chad-madden-22u9dunCITQ-unsplash.jpg')
    .attach('image', 'images/christian-bowen-3JqVQsShG28-unsplash.jpg')
    .attach('image', 'images/clarisse-meyer-d6pLNFVZt_4-unsplash.jpg')
    .attach('image', 'images/katarzyna-grabowska-sRAWQyoUiVQ-unsplash.jpg')
    .attach('image', 'images/lucas-cleutjens-wRHbuIa9Pd0-unsplash.jpg')
    .attach('image', 'images/marek-mucha-j14F47I7NO0-unsplash.jpg')
    .attach('image', 'images/nathalia-segato-QIAtKF3pWqM-unsplash.jpg')
    .attach('image', 'images/nathan-dumlao-EWD9bCDW0EE-unsplash.jpg')
    .attach('image', 'images/nathan-riley-_ir1D49PRqM-unsplash.jpg');

  expect(res.status).to.equal(200);
});

it('get 1 uploaded photo of logged in user', async function () {
  const res = await request(app).get(`/images/${userId}`)
    .set('x-access-token', token)
    .send({ imageIds: [imageIds[0]] });

  const images = res.body.resources;

  expect(images.length).to.be.equal(1);
  expect(res.status).to.equal(200);
  expect(res.body).to.be.an('object');
});

it('get 3 uploaded photos of logged in user', async function () {
  const res = await request(app).get(`/images/${userId}`)
    .set('x-access-token', token)
    .send({ imageIds });

  const images = res.body.resources;

  expect(images.length).to.be.equal(3);
  expect(res.status).to.equal(200);
  expect(res.body).to.be.an('object');
});

it('get all uploaded photos of logged in user', async function () {
  const res = await request(app).get(`/images/${userId}`)
    .set('x-access-token', token);

  const images = res.body.resources;

  expect(images.length).to.be.equal(14);
  expect(res.status).to.equal(200);
  expect(res.body).to.be.an('object');
});

it('delete 3 images with ids', async function () {
  const res = await request(app)
    .delete(`/images/delete/${userId}`)
    .set('x-access-token', token)
    .send({
      imageIds
    });

  expect(res.status).to.equal(200);
  expect(res.body).to.be.an('object');
});

it('get all uploaded photos of logged in user after deletion', async function () {
  const res = await request(app).get(`/images/${userId}`)
    .set('x-access-token', token);

  const images = res.body.resources;
  expect(images.length).to.be.equal(11);
  expect(res.status).to.equal(200);
  expect(res.body).to.be.an('object');
});

it('should delete registered user', async function () {
  const res = await request(app)
    .delete('/user/delete')
    .set('x-access-token', token).send({
      email: 'imagestest@gmail.com',
      password: 'password'
    });

  expect(res.status).to.equal(200);
  expect(res.body).to.be.an('object');
});
