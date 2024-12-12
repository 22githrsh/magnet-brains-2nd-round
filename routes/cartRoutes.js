const express = require('express');
const cartController = require('../controllers/cartController');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

// Add item to cart
router.post('/add', cartController.addToCart);

// View cart
router.get('/', cartController.getCart);

// Checkout page
router.get('/checkout', cartController.getCheckout);

// Checkout process
router.post('/checkout', paymentController.checkout);

// Remove item from cart
router.post('/remove', cartController.removeFromCart);

router.post('/create-checkout-session', cartController.createCheckoutSession);

module.exports = router;
