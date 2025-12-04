// NOTE: A simple in-memory mock. NOT for production.
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

const products = {};
const users = {};
const transactions = [];
const suppliers = {};

function nowISO(){ return new Date().toISOString(); }

module.exports = {
  // Users
  async getUserByEmail(email){
    return Object.values(users).find(u => u.email === email) || null;
  },
  async createUser(payload){
    const id = payload.id || uuidv4();
    const hash = payload.password ? await bcrypt.hash(payload.password, 10) : payload.password;
    const user = { id, email: payload.email, password: hash, role: payload.role || "STAFF", name: payload.name || "" };
    users[id] = user;
    return user;
  },

  // Products
  async getProductById(id){
    return products[id] || null;
  },
  async getProducts(filter){
    return Object.values(products);
  },
  async createProduct(payload){
    const id = payload.id || uuidv4();
    const p = {
      id,
      sku: payload.sku || null,
      name: payload.name,
      quantity: payload.quantity ?? 0,
      costPrice: payload.costPrice ?? 0,
      salePrice: payload.salePrice ?? 0,
      reorderLevel: payload.reorderLevel ?? 0,
      supplierId: payload.supplierId ?? null,
      createdAt: nowISO()
    };
    products[id] = p;
    return p;
  },
  async updateProduct(id, payload){
    const p = products[id];
    if (!p) return null;
    Object.assign(p, payload);
    p.updatedAt = nowISO();
    products[id] = p;
    return p;
  },
  async updateQuantity(id, newQty){
    const p = products[id];
    if (!p) return null;
    p.quantity = newQty;
    p.updatedAt = nowISO();
    return p;
  },

  // Suppliers
  async createSupplier(payload){
    const id = payload.id || uuidv4();
    const s = { id, name: payload.name, contact: payload.contact || null, createdAt: nowISO() };
    suppliers[id] = s;
    return s;
  },
  async getSuppliers(){ return Object.values(suppliers); },
  async getSupplierById(id){ return suppliers[id] || null; },
  async updateSupplier(id,p){ if(!suppliers[id]) return null; Object.assign(suppliers[id],p); return suppliers[id]; },

  // Transactions
  async createTransaction(tx){
    const record = { id: uuidv4(), ...tx };
    transactions.push(record);
    return record;
  },
  async getTransactions(){
    return transactions.slice().reverse();
  },
  async getTransactionsByProduct(productId){
    return transactions.filter(t => t.productId === productId).slice().reverse();
  },
  async getRecentTransactions(limit = 10){
    return transactions.slice(-limit).reverse();
  },

  // Reports convenience
  async getTopProducts(limit = 5){
    // naive: top by quantity descending
    return Object.values(products)
      .sort((a,b)=> (b.quantity||0) - (a.quantity||0))
      .slice(0, limit);
  },
  async getLowStockProducts(){
    return Object.values(products).filter(p => (p.quantity ?? 0) <= (p.reorderLevel ?? 0));
  },

  // low stock alert
  async createLowStockAlert(payload){
    // For mock, just log
    console.log("LOW STOCK ALERT CREATED (mock):", payload);
    return { id: uuidv4(), ...payload };
  }
};
