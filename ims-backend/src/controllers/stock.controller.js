const asyncHandler = require("../middleware/asyncHandler");
const service = require("../services/stock.service");
const { validationResult } = require("express-validator");

exports.stockIn = [
  (req,res,next)=>{
    const err = validationResult(req);
    if (!err.isEmpty()) return res.status(400).json({ errors: err.array() });
    next();
  },
  asyncHandler(async (req,res)=>{
    const { productId, qty, reason } = req.body;
    const result = await service.stockIn(req.user.userId, productId, Number(qty), reason);
    res.json(result);
  })
];

exports.stockOut = [
  (req,res,next)=>{
    const err = validationResult(req);
    if (!err.isEmpty()) return res.status(400).json({ errors: err.array() });
    next();
  },
  asyncHandler(async (req,res)=>{
    const { productId, qty, reason } = req.body;
    const result = await service.stockOut(req.user.userId, productId, Number(qty), reason);
    res.json(result);
  })
];

exports.adjust = [
  (req,res,next)=>{
    const err = validationResult(req);
    if (!err.isEmpty()) return res.status(400).json({ errors: err.array() });
    next();
  },
  asyncHandler(async (req,res)=>{
    const { productId, correctedQty, reason } = req.body;
    const result = await service.adjust(req.user.userId, productId, Number(correctedQty), reason);
    res.json(result);
  })
];
