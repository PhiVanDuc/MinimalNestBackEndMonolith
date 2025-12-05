const express = require("express");
const router = express.Router();

const authController = require("./auth.controller");

router.post("/sign-up", authController.signUp);
router.post("/verify-email", authController.verifyEmail);
router.post("/send-auth-email", authController.sendAuthEmail);
router.post("/sign-in", authController.signIn);
router.post("/reset-password", authController.resetPassword);

module.exports = router;