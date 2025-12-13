const express = require("express");
const router = express.Router();

const authController = require("./auth.controller");

router.post("/sign-up", authController.signUp);
router.post("/sign-in", authController.signIn);
router.post("/email/send", authController.sendAuthEmail);
router.post("/email/verify", authController.verifyEmail);
router.post("/password/reset", authController.resetPassword);
router.post("/tokens/refresh", authController.refreshTokens);

module.exports = router;