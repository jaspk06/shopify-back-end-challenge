import express, { Application } from 'express';
import routes from './routes';

// Boot express
const app: Application = express();

app.use(express.json());

// db init
const db = require('./db');

// Application routing
routes(app);

export default app;
