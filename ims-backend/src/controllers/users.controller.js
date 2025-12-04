const { body, validationResult } = require("express-validator");
const asyncHandler = require("../middleware/asyncHandler");
const usersService = require("../services/users.service");

exports.create = [
  body("email").isEmail(),
  body("password").isString().isLength({ min: 6 }),
  body("role").isIn(["ADMIN","STAFF"]).optional(),
  (req,res,next)=>{
    const err = validationResult(req);
    if (!err.isEmpty()) return res.status(400).json({ errors: err.array() });
    next();
  },
  asyncHandler(async (req,res)=>{
    const payload = req.body;
    const user = await usersService.create(payload);
    res.status(201).json(user);
  })
];
