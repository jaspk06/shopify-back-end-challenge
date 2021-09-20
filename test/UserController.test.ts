import { expect } from 'chai';
import app from '../src/app';
import { agent as request } from 'supertest';

let token: string;

it('should POST /user/register and register a new user', async function () {
  const res = await request(app)
    .post('/user/register').send({
      first_name: 'Jason',
      last_name: 'Liu',
      email: 'test@gmail.com',
      password: 'password'
    });

  expect(res.status).to.equal(201);
  expect(res.body).to.be.an('object');
});

it('should POST /user/register and fail due to user duplication', async function () {
  const res = await request(app)
    .post('/user/register').send({
      first_name: 'Jason',
      last_name: 'Liu',
      email: 'test@gmail.com',
      password: 'password'
    });

  expect(res.status).to.equal(409);
  expect(res.text).to.be.equal('User Already Exist. Please Login');
});

it('should POST /user/register and fail due to empty fields', async function () {
  const res = await request(app)
    .post('/user/register').send({
      first_name: 'Jason',
      last_name: 'Liu',
      email: 'test@gmail.com'
    });

  expect(res.status).to.equal(400);
  expect(res.text).to.be.equal('All input is required');
});

it('should POST /user/login and be successful', async function () {
  const res = await request(app)
    .post('/user/login').send({
      email: 'test@gmail.com',
      password: 'password'
    });

  token = res.body.token;

  expect(res.status).to.equal(200);
  expect(res.body).to.be.an('object');
});

it('should POST /user/login and fail due to incorrect crednetials', async function () {
  const res = await request(app)
    .post('/user/login').send({
      email: 'test@gmail.com',
      password: '123'
    });

  expect(res.status).to.equal(400);
  expect(res.text).to.be.equal('Invalid Credentials');
});

it('should delete registered user', async function () {
  const res = await request(app)
    .delete('/user/delete')
    .set('x-access-token', token)
    .send({
      email: 'test@gmail.com',
      password: 'password'
    });

  expect(res.status).to.equal(200);
  expect(res.body).to.be.an('object');
});
