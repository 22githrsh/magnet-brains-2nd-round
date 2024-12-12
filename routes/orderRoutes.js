const express = require("express");
const orderController = require("../controllers/orderController");

const router = express.Router();

router.post("/checkout", orderController.checkout);
router.get("/success", orderController.paymentSuccess);
router.get("/failure", orderController.paymentFailure);

module.exports = router;
