const db = require("../db/db-adapter");

exports.create = (payload) => db.createSupplier(payload);
exports.list = () => db.getSuppliers();
exports.get = (id) => db.getSupplierById(id);
exports.update = (id, payload) => db.updateSupplier(id, payload);
exports.remove = (id) => db.updateSupplier(id, { deleted: true });
