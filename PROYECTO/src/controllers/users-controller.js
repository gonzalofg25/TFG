import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { getUsers,getClientes,getBarberos,deleteUserByUsername } from '../services/user-db-services.js';

export async function listarBarberos(req, res) {
  try {
    const barberos = await getBarberos();
    return res.status(200).json(barberos);
  } catch (error) {
    console.error("Error en listarBarberos:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function listarClientes(req, res) {
  try {
    const clientes = await getClientes();
    return res.status(200).json(clientes);
  } catch (error) {
    console.error("Error en listarClientes:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function modificarUsuario(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Se requieren el nombre de usuario, correo electrónico y contraseña para la modificación" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El correo electrónico ya está en uso" });
    }

    let hashedPassword;
    if (password) {
      hashedPassword = await User.encryptPassword(password);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
      username,
      email,
      password: hashedPassword
    }, { new: true });

    return res.status(200).json({ message: "Usuario actualizado correctamente", user: updatedUser });
  } catch (error) {
    console.error("Error al modificar usuario:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function mostrarUsuariosAdmin(req, res) {
  try {
    const usuarios = await getUsers({});
    console.log("Usuarios encontrados:", usuarios);

    return res.status(200).json(usuarios);
  } catch (error) {
    console.error("Error en mostrarUsuariosAdmin:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function eliminarUsuarioAdmin(req, res) {
  try {
    const { email } = req.body;

    const usuario = await User.findOne({ email });

    if (!usuario) {
      console.log(`Usuario con correo ${email} no encontrado`);
      return res.status(404).json({ message: `Usuario con correo ${email} no encontrado` });
    }

    await deleteUserByUsername(email);

    console.log("Usuario encontrado y eliminado:", usuario);

    return res.status(200).json({ message: "Usuario eliminado exitosamente", usuario });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
