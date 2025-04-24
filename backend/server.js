import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import boardRoutes from './routes/boardRoutes.js';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';
import setupMailer from './utils/mailer.js';
import cors from 'cors';
import jwt from 'jsonwebtoken';
const port = process.env.PORT ;
const SECRET = process.env.SECRET_KEY; 
const options = { 
    expiresIn: '120m', 
    algorithm: 'HS256' 
  };
connectDB();
setupMailer();
const app = express();
app.use(cors({
    // origin: 'http://localhost:3001',
    origin: "https://collab-x-fe.vercel.app",


    credentials: true, // if you're using cookies or auth headers
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use('/api/boards', boardRoutes);

if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, '/frontend/dist')));

    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
    );
} else {
    app.get('/', (req, res) => {
        res.send('API is running....');
    });
}
app.get('/good-morning', (req, res) => {
    res.send('I hate Mondays!!');
  });
  app.get('/get-token', (req, res) => {

    const payload = {
      apikey: process.env.API_KEY,
      permissions: ['allow_join','allow_mod','allow_rec','allow_upload','allow_chat','allow_hand','allow_rec_play']
    };
  
    const token = jwt.sign(payload, SECRET, options);
    res.json({ token });
    // console.log(token);
  });
  
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`⚡ [server] Started listening on http://localhost:${port}`);
})
