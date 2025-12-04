const express = require("express");
const rateLimiter = require("express-rate-limit");
const cors = require("cors");
const connectToMongoDB = require("./connectToDb");
const { Product, Purchase, Return, Bill, SyncLog } = require("./models/models");
const {
  handleAddNewProduct,
  handleGetAllProducts,
  handleAddNewPurchase,
  handleGetAllPurchases,
  handleGetAllExpiringPurchases,
  handleProcessReturn,
  handleBillProcessing,
  handleGetAllBills,
} = require("./controllers/controllers");
require("dotenv").config();
const PORT = process.env.port;

connectToMongoDB(process.env.MONGOURI).then(() => {
  console.log("Connected to Database");
});

const app = express();
const limiter = rateLimiter({
  windowMs: 60 * 60 * 1000, //1 hour window
  max: 20,
  message: "Too many requests from this IP, please try again after some time",
});

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL }));
// app.use(cors());

app.use((req, res, next) => {
  const methodsToBlock = ["POST", "PUT", "PATCH", "DELETE"];
  if (methodsToBlock.includes(req.method)) {
    return res.status(403).json({ error: "Mutations are disabled." });
  }
  next();
});
