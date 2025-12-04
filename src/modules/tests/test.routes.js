const express = require("express");
const router = express.Router();

const testController = require("./test.controller");

router.get("/", testController.get);
router.post("/", testController.post);
router.put("/", testController.put);
router.patch("/", testController.patch);
router.delete("/", testController.delete);

module.exports = router;