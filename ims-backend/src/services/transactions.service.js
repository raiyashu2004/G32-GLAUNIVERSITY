const db = require("../db/db-adapter");

exports.list = async (q) => {
  if (db.getTransactions) return db.getTransactions(q);
  return { message: "DB does not implement getTransactions" };
};

exports.productHistory = async (productId) => {
  if (db.getTransactionsByProduct) return db.getTransactionsByProduct(productId);
  return { message: "DB does not implement getTransactionsByProduct" };
};
