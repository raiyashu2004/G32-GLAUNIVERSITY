const asyncHandler = require("../middleware/asyncHandler");
const service = require("../services/transactions.service");

exports.list = asyncHandler(async (req,res) => res.json(await service.list(req.query)));
exports.productHistory = asyncHandler(async (req,res) => res.json(await service.productHistory(req.params.id)));
