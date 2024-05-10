import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  email:{
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  roles: [{
    type: String, // Almacenamos directamente el nombre del rol
    enum: ['cliente', 'barbero', 'admin'] // Enumeramos los posibles valores de los roles
  }]
}, {
  timestamps: true,
  versionKey: false,
});

userSchema.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

userSchema.statics.comparePassword = async function(password, receivedPassword) {
  return await bcrypt.compare(password, receivedPassword);
};

export default model('User', userSchema);
