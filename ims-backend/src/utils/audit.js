exports.makeAudit = (userId, productId, type, oldQty, newQty, reason) => ({
  userId,
  productId,
  type,
  oldQty,
  newQty,
  reason: reason || "",
  timestamp: new Date().toISOString()
});
