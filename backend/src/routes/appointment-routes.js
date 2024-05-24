import express from 'express';
import { seleccionarCitaConBarbero, verCitasDelUsuario, verCitasDelBarbero, modificarCita, cancelarCita, getCitasBarberoEnFecha } from '../controllers/appointmentController.js';
import { checkToken } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.post('/cita',checkToken,seleccionarCitaConBarbero)
router.get('/citasusuario',checkToken,verCitasDelUsuario)
router.get('/citasbarbero',checkToken,verCitasDelBarbero)
router.put('/cita/:citaId',checkToken,modificarCita)
router.delete('/cita/:citaId',checkToken,cancelarCita)
router.get('/citasbarbero/:barberName/:date',checkToken,getCitasBarberoEnFecha);

export default router;
