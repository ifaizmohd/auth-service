import { Application } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { AuthMiddleware } from './Auth.middleware';
import { PermissionMiddleware } from './Permissions.middleware';
import { sessionManager } from './SessionManager.middleware';

export function applyMiddlewares(app: Application, PORT: number | string) {
  // options for cors.
  const corsOptions = {
    origin: `http://localhost:${PORT}`,
    allowedHeaders: ['Content-Type'],
    'Access-Control-Allow-Origin': '*',
  };
  // Custom Middleware instances
  const authMiddleWare = new AuthMiddleware();
  const permissionsMiddleware = new PermissionMiddleware();
  // Middlewares
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(cors(corsOptions));
  app.use(authMiddleWare.handle.bind(authMiddleWare));
  app.use(sessionManager);
  app.use(permissionsMiddleware.hasPermissions.bind(permissionsMiddleware));
}
