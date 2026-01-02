const express = require("express");

const productImageMiddleware = require("../../../middlewares/product-image.middleware");

const productController = require("../product.controller");

const router = express.Router();

router.post("/", productController.addProduct);
router.post("/:id/images", productImageMiddleware, productController.addProductImages);

module.exports = router;