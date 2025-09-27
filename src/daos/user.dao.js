import User from '../models/user.model.js';

export default class UserDAO {
  async findById(id) {
    return User.findById(id);
  }
  async findByEmail(email) {
    console.log('Buscando usuario con email:', email);
    const user = await User.findOne({ email });
    console.log('Resultado de la búsqueda:', user);
    return user;
  }
  async create(userData) {
    return User.create(userData);
  }
  async update(id, data) {
    return User.findByIdAndUpdate(id, data, { new: true });
  }
  async delete(id) {
    return User.findByIdAndDelete(id);
  }
  async findAll() {
    return User.find().select('-password');
  }
  async findOne(query) {
    return User.findOne(query);
  }
}