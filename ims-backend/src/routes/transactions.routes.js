const router = require("express").Router();
const ctrl = require("../controllers/transactions.controller");
const auth = require("../middleware/auth");
const roles = require("../middleware/roles");

router.get("/", auth, roles("ADMIN"), ctrl.list);
router.get("/product/:id", auth, roles("ADMIN","STAFF"), ctrl.productHistory);

module.exports = router;
