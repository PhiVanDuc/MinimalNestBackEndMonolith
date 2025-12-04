const express = require("express");
const router = express.Router();

const testRoutes = require("../modules/tests/test.routes");
const authRoutes = require("../modules/auth/auth.routes");

router.get("/", (req, res) => res.send("<p>API</p>"));

router.use("/test", testRoutes);
router.use("/auth", authRoutes);

module.exports = router;