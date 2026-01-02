const express = require("express");
const router = express.Router();

const colorController = require("../color.controller");

router.get("/", colorController.getColors);

module.exports = router;