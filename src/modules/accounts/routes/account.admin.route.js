const express = require("express");
const router = express.Router();

const accountController = require("../account.controller");

router.get("/", accountController.getAccounts);
router.patch("/:id/role", accountController.updateAccountRole);

module.exports = router;