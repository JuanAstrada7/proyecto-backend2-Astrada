import User from '../models/user.model.js';

export default class UserDAO {
  async findById(id) {
    return User.findById(id);
  }
  async findByEmail(email) {
    return User.findOne({ email });
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
}