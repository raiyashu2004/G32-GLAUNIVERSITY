const router = require("express").Router();
const ctrl = require("../controllers/reports.controller");
const auth = require("../middleware/auth");
const roles = require("../middleware/roles");

router.get("/top-products", auth, roles("ADMIN"), ctrl.topProducts);
router.get("/low-stock", auth, roles("ADMIN"), ctrl.lowStock);
router.get("/dashboard/summary", auth, roles("ADMIN"), ctrl.summary);

module.exports = router;
