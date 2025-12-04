const router = require("express").Router();
const controller = require("../controllers/users.controller");
const auth = require("../middleware/auth");
const roles = require("../middleware/roles");

router.post("/", auth, roles("ADMIN"), controller.create);

module.exports = router;

