const asyncHandler = require("../middleware/asyncHandler");
const service = require("../services/suppliers.service");
const { validationResult } = require("express-validator");

exports.list = asyncHandler(async (req,res)=> res.json(await service.list()));
exports.get = asyncHandler(async (req,res)=>{
  const s = await service.get(req.params.id);
  if (!s) return res.status(404).json({ message: "Supplier not found" });
  res.json(s);
});
exports.create = [
  (req,res,next)=>{
    const err = validationResult(req);
    if (!err.isEmpty()) return res.status(400).json({ errors: err.array() });
    next();
  },
  asyncHandler(async (req,res)=> {
    const s = await service.create(req.body);
    res.status(201).json(s);
  })
];
exports.update = asyncHandler(async (req,res)=> res.json(await service.update(req.params.id, req.body)));
exports.remove = asyncHandler(async (req,res)=> res.json(await service.remove(req.params.id)));
