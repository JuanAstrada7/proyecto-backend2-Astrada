export class BaseDAO {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        return this.model.create(data);
    }

    async findById(id) {
        return this.model.findById(id).lean();
    }

    async findOne(filter = {}) {
        return this.model.findOne(filter).lean();
    }

    async findAll(filter = {}, options = {}) {
        const query = this.model.find(filter);
        if (options.sort) query.sort(options.sort);
        if (options.limit) query.limit(options.limit);
        if (options.skip) query.skip(options.skip);
        return query.lean();
    }

    async updateById(id, data) {
        return this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
    }

    async deleteById(id) {
        return this.model.findByIdAndDelete(id).lean();
    }
}