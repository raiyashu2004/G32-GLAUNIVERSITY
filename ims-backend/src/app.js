const express = require("express");
const cors = require("cors");
const expressValidator = require("express-validator");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/users.routes");
const productRoutes = require("./routes/products.routes");
const supplierRoutes = require("./routes/suppliers.routes");
const stockRoutes = require("./routes/stock.routes");
const reportsRoutes = require("./routes/reports.routes");
const transactionsRoutes = require("./routes/transactions.routes");

const errorHandler = require("./middleware/errorHandler");
const { initDb } = require("./mock/mock-init");

const app = express();

app.use(cors());
app.use(express.json());

// Initialize db: if using mock, set global.db
initDb();

// routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/suppliers", supplierRoutes);
app.use("/stock", stockRoutes);
app.use("/reports", reportsRoutes);
app.use("/transactions", transactionsRoutes);

// health
app.get("/health", (req, res) => res.json({ status: "ok" }));

// error handling (last)
app.use(errorHandler);

module.exports = app;
