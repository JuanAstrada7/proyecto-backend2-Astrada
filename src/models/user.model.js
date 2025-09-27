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
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
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
  return {
    id: this._id,
    first_name: this.first_name,
    last_name: this.last_name,
    email: this.email,
    age: this.age,
    cart: this.cart,
    role: this.role,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

const User = mongoose.model('User', userSchema);

export default User;