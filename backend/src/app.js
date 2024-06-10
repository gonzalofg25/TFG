import express from 'express';
import { init } from './loaders/index.js';
import config from './config.js';
import { jsonParser } from './middlewares/auth-middleware.js';
import authRoutes from './routes/auth-routes.js';
import userRoutes from './routes/user-router.js';
import appointmentRoutes from './routes/appointment-routes.js';
import reviewRoutes from './routes/review-routes.js'
import cors from 'cors';

const app = express();

app.use(cors({
  origin: 'https://resonant-lebkuchen-745e2c.netlify.app/',
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(jsonParser);

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/appoint', appointmentRoutes);
app.use('/api/review', reviewRoutes)

init(app, config);

export default app;
