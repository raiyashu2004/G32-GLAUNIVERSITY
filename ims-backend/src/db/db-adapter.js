const db = global.db;

const ok = (fn) => {
  if (!db || typeof db[fn] !== "function") {
    // Provide fallback handler that throws clear error
    return (..._args) => {
      throw new Error(`DB function ${fn}() is not implemented. Provide global.db.${fn} or enable mock DB.`);
    };
  }
  return (...args) => db[fn](...args);
};

module.exports = {
  getProductById: ok("getProductById"),
  getProducts: ok("getProducts"),
  createProduct: ok("createProduct"),
  updateProduct: ok("updateProduct"),
  updateQuantity: ok("updateQuantity"),
  createTransaction: ok("createTransaction"),
  getTopProducts: ok("getTopProducts"),
  getLowStockProducts: ok("getLowStockProducts"),
  getUserByEmail: ok("getUserByEmail"),
  createUser: ok("createUser"),
  // optional
  getTransactions: ok("getTransactions"),
  getTransactionsByProduct: ok("getTransactionsByProduct"),
  getRecentTransactions: ok("getRecentTransactions"),
  createLowStockAlert: ok("createLowStockAlert"),
  createSupplier: ok("createSupplier"),
  getSuppliers: ok("getSuppliers"),
  getSupplierById: ok("getSupplierById"),
  updateSupplier: ok("updateSupplier")
};
