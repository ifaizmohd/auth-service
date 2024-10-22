import { Express } from 'express';
import AuthController from '../controllers';
import { API_PREFIX } from './Routes.constants';

export function registerRutes(app: Express) {
  app.use(API_PREFIX, AuthController);
}
