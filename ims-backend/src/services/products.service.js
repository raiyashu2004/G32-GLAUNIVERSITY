const db = require("../db/db-adapter");

exports.list = (q) => db.getProducts(q);
exports.get = (id) => db.getProductById(id);
exports.create = (payload) => db.createProduct(payload);
exports.update = (id, payload) => db.updateProduct(id, payload);
exports.remove = (id) => db.updateProduct(id, { deleted: true });
