import UserDAO from '../daos/user.dao.js';

export default class UserRepository {
    constructor() {
        this.dao = new UserDAO();
    }
    getById(id) {
        return this.dao.findById(id);
    }
    getByEmail(email) {
        return this.dao.findByEmail(email);
    }
    create(userData) {
        return this.dao.create(userData);
    }
    update(id, data) {
        return this.dao.update(id, data);
    }
    delete(id) {
        return this.dao.delete(id);
    }
    getAll() {
        return this.dao.findAll();
    }
    getByPhone(phone) {
        return this.dao.findOne({ phone });
    }
}