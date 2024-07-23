import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import Connection from './database/db.js';
import Router from './routes/route.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// Serve uploaded files

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', Router);

const PORT = 8000;
app.listen(PORT, () => console.log(`Running successfully on ${PORT}`));

const HOST = process.env.DB_HOST;
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const DATABASE = process.env.DB_NAME;

Connection(HOST, USER, PASSWORD, DATABASE);
