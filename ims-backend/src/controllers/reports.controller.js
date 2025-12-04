const asyncHandler = require("../middleware/asyncHandler");
const service = require("../services/reports.service");

exports.topProducts = asyncHandler(async (req,res) => {
  const limit = Number(req.query.limit) || 5;
  res.json(await service.topProducts(limit));
});

exports.lowStock = asyncHandler(async (req,res) => res.json(await service.lowStock()));

exports.summary = asyncHandler(async (req,res) => res.json(await service.summary()));
