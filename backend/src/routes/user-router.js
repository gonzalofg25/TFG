import express from 'express';
import { listarBarberos,listarClientes, mostrarUsuariosAdmin, eliminarUsuarioAdmin, modificarUsuario } from '../controllers/users-controller.js';
import { checkToken,checkAdmin } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.get('/barbers',checkToken,listarBarberos);
router.get('/clientes',checkToken,listarClientes);
router.get('/listadmin',checkAdmin,mostrarUsuariosAdmin);
router.delete('/borraradmin',checkAdmin,eliminarUsuarioAdmin)
router.put('/modificar',checkToken, modificarUsuario)

export default router;
