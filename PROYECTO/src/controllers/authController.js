import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import Config from '../config.js';
import { jsonParser, isValidEmail } from '../middlewares/auth-middleware.js';

export const signup = async (req, res) => {
  try {
    jsonParser(req, res, async () => {
      const { username, email, password, roles } = req.body;

      if (!isValidEmail(email)) {
        return res.status(400).json({ message: "El formato del correo electrónico es inválido" });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      const newUser = new User({
        username,
        email,
        password: await User.encryptPassword(password),
        roles: roles ? roles : ['cliente']
      });

      await newUser.save();

      res.status(200).json({ message: 'User registered successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });

    if (!userFound) {
      return res.status(400).json({ message: "User not found" });
    }

    const matchPassword = await User.comparePassword(password, userFound.password);

    if (!matchPassword) {
      return res.status(401).json({ token: null, message: 'Invalid password' });
    }

    // Genera el token que incluye el id, los roles y el nombre de usuario del usuario
    const token = jwt.sign({
      id: userFound._id,
      roles: userFound.roles,
      username: userFound.username
    }, Config.SECRET, {
      expiresIn: 86400
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
