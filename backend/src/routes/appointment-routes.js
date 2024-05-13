import express from 'express';
import { seleccionarCitaConBarbero, verCitasDelUsuario, verCitasDelBarbero } from '../controllers/appointmentController.js';
import { checkToken } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.post('/cita',checkToken,seleccionarCitaConBarbero)
router.get('/citasusuario',checkToken,verCitasDelUsuario)
router.get('/citasbarbero',checkToken,verCitasDelBarbero)

export default router;
