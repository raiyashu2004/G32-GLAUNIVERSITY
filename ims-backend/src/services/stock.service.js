const db = require("../db/db-adapter");
const { makeAudit } = require("../utils/audit");

async function checkLowStock(product, newQty) {
  if (newQty <= (product.reorderLevel ?? 0)) {
    const payload = { productId: product.id, newQty, reorderLevel: product.reorderLevel, timestamp: new Date().toISOString() };
    console.log("LOW STOCK:", payload);
    // Create a persistent low-stock alert if DB supports it
    if (db.createLowStockAlert) {
      try { await db.createLowStockAlert(payload); } catch(e){ console.warn("createLowStockAlert failed:", e.message); }
    }
  }
}

exports.stockIn = async (userId, productId, qty, reason) => {
  // fetch
  const product = await db.getProductById(productId);
  if (!product) throw { status: 404, message: "Product not found" };
  const oldQty = product.quantity ?? 0;
  const newQty = oldQty + qty;

  // update quantity
  await db.updateQuantity(productId, newQty);

  // create transaction
  await db.createTransaction(makeAudit(userId, productId, "IN", oldQty, newQty, reason));

  // low-stock check
  await checkLowStock(product, newQty);

  return { productId, oldQty, newQty };
};

exports.stockOut = async (userId, productId, qty, reason) => {
  const product = await db.getProductById(productId);
  if (!product) throw { status: 404, message: "Product not found" };
  const oldQty = product.quantity ?? 0;
  if (oldQty < qty) throw { status: 400, message: "Insufficient stock" };
  const newQty = oldQty - qty;

  await db.updateQuantity(productId, newQty);
  await db.createTransaction(makeAudit(userId, productId, "OUT", oldQty, newQty, reason));
  await checkLowStock(product, newQty);

  return { productId, oldQty, newQty };
};

exports.adjust = async (userId, productId, correctedQty, reason) => {
  const product = await db.getProductById(productId);
  if (!product) throw { status: 404, message: "Product not found" };
  const oldQty = product.quantity ?? 0;
  const newQty = correctedQty >= 0 ? correctedQty : 0;

  await db.updateQuantity(productId, newQty);
  await db.createTransaction(makeAudit(userId, productId, "ADJUST", oldQty, newQty, reason));
  await checkLowStock(product, newQty);

  return { productId, oldQty, newQty };
};
