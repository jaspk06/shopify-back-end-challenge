import { Application, Router } from 'express';
import { UserController } from './controllers/UserController';
import { ImagesController } from './controllers/ImagesController';

const _routes: [string, Router][] = [
  ['/user', UserController],
  ['/images', ImagesController]
];

const routes = (app: Application) => {
  _routes.forEach((route) => {
    const [url, controller] = route;
    app.use(url, controller);
  });
};

export default routes;
