const express = require("express");
const passportConfig = require("../../configs/passport.config");

const router = express.Router();
const authController = require("./auth.controller");

// Google OAuth
router.get(
    "/google",
    passportConfig.authenticate(
        "google",
        {
            scope: ["profile", "email"],
            prompt: "select_account"
        }
    )
);

router.get(
    "/google/callback",
    passportConfig.authenticate(
        "google",
        { 
            session: false,
            failureRedirect: `${process.env.FE}/google-sign-in/failed` 
        }
    ),
    authController.googleSignIn
);

router.post("/google/exchange", authController.googleExchange);

// Credentials
router.post("/sign-up", authController.signUp);
router.post("/sign-in", authController.signIn);
router.post("/email/send", authController.sendAuthEmail);
router.post("/email/verify", authController.verifyEmail);
router.post("/password/reset", authController.resetPassword);
router.post("/tokens/refresh", authController.refreshTokens);

module.exports = router;