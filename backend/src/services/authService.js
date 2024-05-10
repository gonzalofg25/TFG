import User from '../models/User.js';
import mongoose from 'mongoose';
export async function getUserByName(username) {
  try {
    const user = await User.findOne({ username });
    return user;
  } catch (error) {
    throw new Error(`Error al buscar el usuario por nombre de usuario: ${error.message}`);
  }
}

export async function getUsers(filters) {
  try {
    const users = await User.find(filters);
    return users;
  } catch (error) {
    throw error;
  }
}

export async function getBarberos() {
  try {
    const barberoRoleId = new mongoose.Types.ObjectId('65eca0c6b5f93385be092831');
    const barberos = await User.find({ roles: barberoRoleId },{ _id: 0, username: 1, email: 1 });
    return barberos;
  } catch (error) {
    throw new Error('Error al obtener los barberos: ' + error.message);
  }
}


export async function getClientes() {
  try {
    const clienteRoleId = new mongoose.Types.ObjectId('65eca0c6b5f93385be092830');
    const clientes = await User.find({ roles: clienteRoleId }, { _id: 0, username: 1, email: 1 });
    return clientes;
  } catch (error) {
    throw new Error('Error al obtener los clientes: ' + error.message);
  }
}

export async function deleteUserByUsername(email) {
  try {
    await User.deleteOne({ email });
  } catch (error) {
    throw error;
  }
}
