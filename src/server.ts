import dotenv from 'dotenv';
import path from 'path';
dotenv.config({
  path: path.join(__dirname, `../config/.env.${process.env.NODE_ENV}`),
});
import express from 'express';
import { registerRutes } from './routes';
import { Database } from './services/Database.service';
import { RedisClient } from './services/Redis.service';
import { applyMiddlewares } from './middlewares';

const app = express();
const PORT = process.env.PORT || 3000;

// Applying middlewares.
applyMiddlewares(app, PORT);

// Your routes goes here.
registerRutes(app);
Database.connect();
RedisClient.connect();

app.listen(PORT, () => {
  console.log(`Your app is running on url: http://localhost:${PORT}`);
});
