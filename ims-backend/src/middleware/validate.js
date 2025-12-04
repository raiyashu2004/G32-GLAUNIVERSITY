const { validationResult } = require("express-validator");

function validate(req, res, next) {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  const formatted = result.array().map(err => ({
    field: err.param,
    message: err.msg,
    location: err.location,
    value: err.value,
  }));

  return res.status(400).json({
    message: "Validation failed",
    errors: formatted,
  });
}

module.exports = validate;
