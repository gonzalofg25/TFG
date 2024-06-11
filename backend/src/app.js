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

const allowedOrigins = ['http://localhost:3001', 'https://resonant-lebkuchen-745e2c.netlify.app','http://resonant-lebkuchen-745e2c.netlify.app', 'https://tfg-ndno.onrender.com', 'http://tfg-ndno.onrender.com'];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'El origen ' + origin + ' no está permitido por la política de CORS';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(jsonParser);

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/appoint', appointmentRoutes);
app.use('/api/review', reviewRoutes)

init(app, config);

export default app;
