import dotenv from 'dotenv';
import path from 'path';
dotenv.config({
  path: path.join(__dirname, `../config/.env.${process.env.NODE_ENV}`),
});
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { registerRutes } from './routes';
import { Database } from './services/Database.service';
import { sessionManager } from './middlewares/SessionManager.middleware';
import { RedisClient } from './services/Redis.service';
import { AuthMiddleware } from './middlewares/Auth.middleware';
import { PermissionMiddleware } from './middlewares/Permissions.middleware';

const app = express();
const PORT = process.env.PORT || 3000;

// options for cors.
const corsOptions = {
  origin: `http://localhost:${PORT}`,
  allowedHeaders: ['Content-Type'],
};
const authMiddleWare = new AuthMiddleware();
const permissionsMiddleware = new PermissionMiddleware();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(authMiddleWare.handle.bind(authMiddleWare));
app.use(sessionManager);
app.use(permissionsMiddleware.hasPermissions.bind(permissionsMiddleware));

// Your routes goes here.
registerRutes(app);
Database.connect();
RedisClient.connect();

app.listen(PORT, () => {
  console.log(`Your app is running on url: http://localhost:${PORT}`);
});
