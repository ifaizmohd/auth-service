import dotenv from 'dotenv';
import path from 'path';
dotenv.config({
  path: path.join(__dirname, `../config/.env.${process.env.NODE_ENV}`),
});
import express from 'express';
import bodyParser from 'body-parser';
import { registerRutes } from './routes';
import { Database } from './services/Database.service';
import { sessionManager } from './middlewares/SessionManager.middleware';
import { RedisClient } from './services/Redis.service';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessionManager);

// Your routes goes here.
registerRutes(app);
Database.connect();
RedisClient.connect();

app.listen(PORT, () => {
  console.log(`Your app is running on url: http://localhost:${PORT}`);
});
