const { body, validationResult } = require("express-validator");
const authService = require("../services/auth.service");
const asyncHandler = require("../middleware/asyncHandler");

exports.login = [
  body("email").isEmail(),
  body("password").isString().notEmpty(),
  (req, res, next) => {
    const err = validationResult(req);
    if (!err.isEmpty()) return res.status(400).json({ errors: err.array() });
    next();
  },
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const token = await authService.login(email, password);
    if (!token) return res.status(401).json({ message: "Invalid credentials" });
    res.json(token);
  })
];
