import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoute from './routes/auth.js';
import userRoute from './routes/user.js';
import hairdresserRoute from './routes/hairdresser.js';
import reservationRoute from './routes/reservation.js';
import serviceRoute from './routes/service.js';
import openingHoursRoute from './routes/openingHours.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

const corsOptions = {
    origin: true
};

app.get('/', (req, res) => {
    res.send('Api is working!');
});

// Database connection
mongoose.set('strictQuery', false);
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Serwowanie plików statycznych
const __dirname = path.resolve();
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/api/openingHours', openingHoursRoute);
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/hairdressers', hairdresserRoute);
app.use('/api/reservations', reservationRoute);
app.use('/api/services', serviceRoute);


app.listen(port, () => {
    connectDB();
    console.log(`Server started on port ${port}`);
});