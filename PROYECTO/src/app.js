import express from 'express';
import { init } from './loaders/index.js';
import config from './config.js';
import { jsonParser } from './middlewares/auth-middleware.js';
import authRoutes from './routes/auth-routes.js';
import userRoutes from './routes/user-router.js';
import appointmentRoutes from './routes/appointment-routes.js';
import cors from 'cors'; // Importa el middleware CORS

const app = express();

// Middleware para permitir solicitudes CORS desde el dominio del frontend
app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(jsonParser);

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/appoint', appointmentRoutes);

init(app, config);

export default app;
