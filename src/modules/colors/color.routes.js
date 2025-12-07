const express = require("express");
const router = express.Router();

const colorController = require("./color.controller");

router.get("/", colorController.getColors);
router.get("/:id", colorController.getColor);
router.post("/", colorController.addColor);
router.put("/:id", colorController.updateColor);
router.delete("/:id", colorController.deleteColor);

module.exports = router;