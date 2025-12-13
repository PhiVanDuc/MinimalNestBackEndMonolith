const express = require("express");
const router = express.Router();

const authRoute = require("../modules/auth/auth.route");
const colorAdminRoute = require("../modules/colors/routes/color.admin.route");

router.use("/auth", authRoute);
router.use("/admin/colors", colorAdminRoute);

module.exports = router;