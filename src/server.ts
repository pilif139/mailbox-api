import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db';

//routes
import userRoutes from './routes/user.route';
import mailRoutes from './routes/mail.route';

//middlewares
import checkAuth from './middlewares/checkAuth';
import cookieParser from 'cookie-parser';
import notFound from './middlewares/not-found';
import errorHandler from './middlewares/error';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use( userRoutes);
app.use(checkAuth,mailRoutes);

app.get('/', (_, res) => {
  res.send('Welcome to the mailbox api!');
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    connectDB();
    console.log("Server is running on http://localhost:"+ PORT);
});