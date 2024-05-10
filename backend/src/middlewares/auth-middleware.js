import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import Config from '../config.js';
import User from '../models/User.js';

export function checkToken(req, res, next) {
  try {
    const token = req.headers["authorization"];

    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, Config.SECRET);
    console.log("Decoded token:", decoded);

    User.findById(decoded.id)
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        req.user = user;
        next();
      })
      .catch(error => {
        console.error(error);
        return res.status(401).json({ message: "Unauthorized" });
      });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export async function checkAdmin(req, res, next) {
  try {
    const token = req.headers["authorization"];

    if (!token) {
      console.log("No se proporcionó ningún token");
      return res.status(403).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, Config.SECRET);
    console.log("Token decodificado:", decoded);

    const user = await User.findById(decoded.id);

    if (!user) {
      console.log("Usuario no encontrado");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Usuario encontrado:", user);

    // Verificar si el usuario tiene el rol de administrador
    const isAdmin = user.roles.includes("admin");
    console.log("¿Es administrador?", isAdmin);

    if (isAdmin) {
      console.log("El usuario es un administrador, permitiendo el acceso");
      next();
    } else {
      console.log("El usuario no es un administrador");
      return res.status(403).json({ message: "User is not an admin" });
    }
  } catch (error) {
    console.error("Error en el middleware checkAdmin:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export const jsonParser = bodyParser.json();
