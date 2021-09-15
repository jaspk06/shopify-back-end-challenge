import express, { Application } from 'express';
import { routes } from './routes';

// Boot express
export const app: Application = express();

app.use(express.json());

// db init
const db = require('./db');

// Application routing
routes(app);
