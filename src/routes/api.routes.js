const express = require("express");
const router = express.Router();

const testRoutes = require("../modules/tests/test.routes");
const authRoutes = require("../modules/auth/auth.routes");
const colorsRoutes = require("../modules/colors/color.routes");

router.get("/", (req, res) => res.send("<p>API</p>"));
router.use("/test", testRoutes);
router.use("/auth", authRoutes);

// router.use(authMiddleware);

router.use("/colors", colorsRoutes);

module.exports = router;