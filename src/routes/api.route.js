const express = require("express");

const authenticationMiddleware = require("../middlewares/authentication.middleware");

const authRoute = require("../modules/auth/auth.route");
const publicCategoryRoute = require("../modules/categories/routes/category.public.route");
const publicColorRoute = require("../modules/colors/routes/color.public.route");

const adminAccountRoute = require("../modules/accounts/routes/account.admin.route");
const adminCategoryRoute = require("../modules/categories/routes/category.admin.route");
const adminColorRoute = require("../modules/colors/routes/color.admin.route");
const adminProductRoute = require("../modules/products/routes/product.admin.route");

const router = express.Router();

router.use("/auth", authRoute);
router.use("/categories", publicCategoryRoute);
router.use("/colors", publicColorRoute);
router.use("/admin/products", adminProductRoute);

router.use(authenticationMiddleware);
router.use("/admin/accounts", adminAccountRoute);
router.use("/admin/categories", adminCategoryRoute);
router.use("/admin/colors", adminColorRoute);

module.exports = router;