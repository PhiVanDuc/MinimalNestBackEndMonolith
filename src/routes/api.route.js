const express = require("express");
const router = express.Router();

const authenticationMiddleware = require("../middlewares/authentication.middleware");

const authRoute = require("../modules/auth/auth.route");

const accountAdminRoute = require("../modules/accounts/routes/account.admin.route");
const categoryAdminRoute = require("../modules/categories/routes/category.admin.route");
const colorAdminRoute = require("../modules/colors/routes/color.admin.route");

router.use("/auth", authRoute);

router.use(authenticationMiddleware);
router.use("/admin/accounts", accountAdminRoute);
router.use("/admin/categories", categoryAdminRoute);
router.use("/admin/colors", colorAdminRoute);

module.exports = router;