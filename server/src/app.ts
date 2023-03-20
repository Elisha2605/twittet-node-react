import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './routes/userRoutes';
import loginRouter from './routes/loginRoutes';

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(cors());

app.use('/api/great', userRouter);
app.use('/api/login', loginRouter);

export default app;
