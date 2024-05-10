import User from '../models/User.js';
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
    const usuarioAutenticado = req.user;

    // Verificar si hay un usuario autenticado
    if (!usuarioAutenticado) {
      console.error("No se pudo obtener el usuario autenticado");
      return res.status(401).json({ message: "No se pudo obtener el usuario autenticado" });
    }

    // Si se proporciona una contraseña, encriptarla
    let hashedPassword;
    if (password) {
      hashedPassword = await User.encryptPassword(password);
    }

    // Actualizar la información del usuario
    const updatedUser = await User.findByIdAndUpdate(usuarioAutenticado._id, {
      username,
      email,
      password: hashedPassword
    }, { new: true });

    if (!updatedUser) {
      console.error("No se pudo actualizar el usuario");
      return res.status(500).json({ message: "No se pudo actualizar el usuario" });
    }

    console.log("Usuario actualizado correctamente:", updatedUser);
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
