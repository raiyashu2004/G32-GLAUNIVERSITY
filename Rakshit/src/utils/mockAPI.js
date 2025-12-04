// Mock API with realistic inventory data
import dayjs from 'dayjs';

// Generate mock data
const categories = ['Electronics', 'Clothing', 'Food & Beverage', 'Home & Garden', 'Sports', 'Books', 'Toys'];
const suppliers = ['Acme Corp', 'Global Suppliers Inc', 'Best Wholesale', 'Premium Goods Ltd', 'Direct Import Co'];

const generateProducts = () => {
  const products = [];
  for (let i = 1; i <= 250; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const quantity = Math.floor(Math.random() * 200);
    products.push({
      id: i,
      sku: `SKU-${String(i).padStart(6, '0')}`,
      name: `Product ${i}`,
      category,
      quantity,
      price: (Math.random() * 500 + 10).toFixed(2),
      cost: (Math.random() * 300 + 5).toFixed(2),
      reorderThreshold: 20 + Math.floor(Math.random() * 30),
      supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
      lastRestocked: dayjs().subtract(Math.floor(Math.random() * 60), 'days').format('YYYY-MM-DD'),
      image: `https://picsum.photos/seed/${i}/200/200`,
      description: `High-quality ${category.toLowerCase()} product with excellent features and competitive pricing.`,
      barcode: `${Math.random().toString().slice(2, 15)}`,
      weight: (Math.random() * 10 + 0.5).toFixed(2),
      dimensions: `${Math.floor(Math.random() * 50 + 10)}x${Math.floor(Math.random() * 50 + 10)}x${Math.floor(Math.random() * 50 + 10)} cm`,
    });
  }
  return products;
};

const products = generateProducts();

const generateOrders = () => {
  const orders = [];
  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  
  for (let i = 1; i <= 150; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const itemCount = Math.floor(Math.random() * 5) + 1;
    const items = [];
    let total = 0;
    
    for (let j = 0; j < itemCount; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      const subtotal = product.price * quantity;
      total += subtotal;
      items.push({
        productId: product.id,
        name: product.name,
        sku: product.sku,
        quantity,
        price: product.price,
        subtotal: subtotal.toFixed(2),
      });
    }
    
    orders.push({
      id: i,
      orderNumber: `ORD-${String(i).padStart(6, '0')}`,
      customerName: `Customer ${i}`,
      customerEmail: `customer${i}@email.com`,
      status,
      items,
      total: total.toFixed(2),
      createdAt: dayjs().subtract(Math.floor(Math.random() * 30), 'days').format('YYYY-MM-DD HH:mm:ss'),
      shippingAddress: `${Math.floor(Math.random() * 9999)} Main St, City, State ${Math.floor(Math.random() * 99999)}`,
    });
  }
  return orders;
};

const orders = generateOrders();

const generateStockMovements = (days = 30) => {
  const movements = [];
  for (let i = 0; i < days; i++) {
    const date = dayjs().subtract(i, 'days').format('YYYY-MM-DD');
    movements.push({
      date,
      stock_in: Math.floor(Math.random() * 200) + 50,
      stock_out: Math.floor(Math.random() * 180) + 30,
    });
  }
  return movements.reverse();
};

// API Functions with simulated delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAPI = {
  async getSummary() {
    await delay(400);
    const totalProducts = products.length;
    const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const lowStockCount = products.filter(p => p.quantity > 0 && p.quantity <= p.reorderThreshold).length;
    const outOfStockCount = products.filter(p => p.quantity === 0).length;
    
    return {
      totalProducts,
      totalInventoryValue: totalInventoryValue.toFixed(2),
      lowStockCount,
      outOfStockCount,
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      revenue: orders.reduce((sum, o) => sum + parseFloat(o.total), 0).toFixed(2),
    };
  },

  async getCategoryDistribution() {
    await delay(400);
    const distribution = {};
    products.forEach(p => {
      distribution[p.category] = (distribution[p.category] || 0) + p.quantity;
    });
    
    return Object.entries(distribution).map(([category, quantity]) => ({
      category,
      quantity,
    }));
  },

  async getTopProducts(limit = 5) {
    await delay(400);
    return [...products]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, limit)
      .map(p => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        quantity: p.quantity,
        value: (p.price * p.quantity).toFixed(2),
      }));
  },

  async getStockMovements(range = 30) {
    await delay(400);
    return generateStockMovements(range);
  },

  async getLowStockItems() {
    await delay(400);
    return products
      .filter(p => p.quantity <= p.reorderThreshold)
      .sort((a, b) => a.quantity - b.quantity)
      .slice(0, 20)
      .map(p => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        category: p.category,
        quantity: p.quantity,
        reorderThreshold: p.reorderThreshold,
        supplier: p.supplier,
      }));
  },

  async getProducts({ page = 1, limit = 20, search = '', category = '', sortBy = 'name' }) {
    await delay(500);
    
    let filtered = [...products];
    
    if (search) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }
    
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'quantity': return b.quantity - a.quantity;
        case 'price': return b.price - a.price;
        default: return 0;
      }
    });
    
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      products: filtered.slice(start, end),
      total: filtered.length,
      page,
      totalPages: Math.ceil(filtered.length / limit),
    };
  },

  async getProduct(id) {
    await delay(300);
    return products.find(p => p.id === parseInt(id));
  },

  async getOrders({ page = 1, limit = 20, status = '' }) {
    await delay(500);
    
    let filtered = [...orders];
    
    if (status) {
      filtered = filtered.filter(o => o.status === status);
    }
    
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      orders: filtered.slice(start, end),
      total: filtered.length,
      page,
      totalPages: Math.ceil(filtered.length / limit),
    };
  },

  async getOrder(id) {
    await delay(300);
    return orders.find(o => o.id === parseInt(id));
  },
};

export { categories, suppliers, products, orders };
