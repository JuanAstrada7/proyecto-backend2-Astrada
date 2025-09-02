import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  age: {
    type: Number,
    required: true,
    min: 0
  },
  password: {
    type: String,
    required: true
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart'
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin', 'premium']
  }
}, {
  timestamps: true
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();

  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

userSchema.methods.verificarContraseña = function (contraseña) {
  return bcrypt.compareSync(contraseña, this.password);
};

userSchema.methods.obtenerDatosPublicos = function () {
  const datosUsuario = this.toObject();
  delete datosUsuario.password;
  return datosUsuario;
};

const User = mongoose.model('User', userSchema);

export default User;