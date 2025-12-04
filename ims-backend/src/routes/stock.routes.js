const router = require("express").Router();
const ctrl = require("../controllers/stock.controller");
const auth = require("../middleware/auth");
const roles = require("../middleware/roles");
const { body } = require("express-validator");

router.post("/in",
  auth, roles("ADMIN","STAFF"),
  body("productId").isString().notEmpty(),
  body("qty").isInt({ min: 1 }),
  ctrl.stockIn
);

router.post("/out",
  auth, roles("ADMIN","STAFF"),
  body("productId").isString().notEmpty(),
  body("qty").isInt({ min: 1 }),
  ctrl.stockOut
);

router.post("/adjust",
  auth, roles("ADMIN","STAFF"),
  body("productId").isString().notEmpty(),
  body("correctedQty").isInt({ min: 0 }),
  ctrl.adjust
);

module.exports = router;
