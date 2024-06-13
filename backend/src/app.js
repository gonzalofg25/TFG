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

const allowedOrigins = ['http://localhost:3001', 'https://barberdates.netlify.app','http://barberdates.netlify.app', 'https://tfg-ndno.onrender.com', 'http://tfg-ndno.onrender.com', '*', 'https://66688cfac46ea2166dbc26ca--barberdates.netlify.app','https://666b0562b368de45e5ac9d93--barberdates.netlify.app'];

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
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(jsonParser);

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/appoint', appointmentRoutes);
app.use('/api/review', reviewRoutes)

init(app, config);

export default app;
