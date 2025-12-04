const router = require("express").Router();
const controller = require("../controllers/products.controller");
const auth = require("../middleware/auth");
const roles = require("../middleware/roles");
const { body } = require("express-validator");

router.get("/", auth, roles("ADMIN","STAFF"), controller.list);
router.get("/:id", auth, roles("ADMIN","STAFF"), controller.get);

router.post("/",
  auth, roles("ADMIN"),
  body("name").isString().notEmpty(),
  body("quantity").optional().isInt({ min: 0 }),
  controller.create
);

router.put("/:id",
  auth, roles("ADMIN"),
  controller.update
);

router.delete("/:id", auth, roles("ADMIN"), controller.remove);

module.exports = router;
