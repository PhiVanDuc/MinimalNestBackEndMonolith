const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send(`
        <p>Server Minimal Nest</p>
    `);
});

module.exports = router;