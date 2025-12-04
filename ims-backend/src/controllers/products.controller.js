const asyncHandler = require("../middleware/asyncHandler");
const service = require("../services/products.service");
const { validationResult } = require("express-validator");

exports.list = asyncHandler(async (req, res) => {
  const list = await service.list(req.query);
  res.json(list);
});

exports.get = asyncHandler(async (req, res) => {
  const p = await service.get(req.params.id);
  if (!p) return res.status(404).json({ message: "Product not found" });
  res.json(p);
});

exports.create = [
  (req,res,next)=>{
    const err = validationResult(req);
    if (!err.isEmpty()) return res.status(400).json({ errors: err.array() });
    next();
  },
  asyncHandler(async (req,res)=>{
    const created = await service.create(req.body);
    res.status(201).json(created);
  })
];

exports.update = asyncHandler(async (req,res)=>{
  const updated = await service.update(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: "Product not found" });
  res.json(updated);
});

exports.remove = asyncHandler(async (req,res)=>{
  const removed = await service.remove(req.params.id);
  res.json({ success: true, result: removed });
});
