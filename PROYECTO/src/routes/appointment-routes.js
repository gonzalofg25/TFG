import express from 'express';
import { seleccionarCitaConBarbero } from '../controllers/appointmentController.js';
import { checkToken } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.post('/cita',checkToken,seleccionarCitaConBarbero)

export default router;