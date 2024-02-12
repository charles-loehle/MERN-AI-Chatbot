import express from 'express';
import { config } from 'dotenv';
import morgan from 'morgan';
import appRouter from './routes/index.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

config();
const app = express();

// middleware
// communicate with frontend
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// remove if in production
app.use(morgan('dev'));

// all routes start with http://localhost:5000/api/v1/
app.use('/api/v1/', appRouter);

export default app;
