const db = require("../db/db-adapter");

exports.topProducts = (limit = 5) => db.getTopProducts(limit);

exports.lowStock = () => db.getLowStockProducts();

exports.summary = async () => {
  const products = await db.getProducts();
  const totalProducts = products.length;
  const totalInventoryValue = products.reduce((sum, p) => sum + ((p.quantity ?? 0) * (p.costPrice ?? 0)), 0);
  const lowStockCount = products.filter(p => (p.quantity ?? 0) <= (p.reorderLevel ?? 0)).length;

  let recentTransactions = [];
  if (db.getRecentTransactions) recentTransactions = await db.getRecentTransactions(10);

  return { totalProducts, totalInventoryValue, lowStockCount, recentTransactions };
};
