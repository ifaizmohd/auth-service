import dotenv from 'dotenv';
import path from 'path';
dotenv.config({
  path: path.join(__dirname, `../config/.env.${process.env.NODE_ENV}`),
});
import express from 'express';
import bodyParser from 'body-parser';
import { registerRutes } from './routes';
import { Database } from './services/Database.service';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Your routes goes here.
registerRutes(app);
Database.connect();

app.listen(PORT, () => {
  console.log(`Your app is running on port: ${PORT}`);
});
