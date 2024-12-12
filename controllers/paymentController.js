const Cart = require('../models/cart');
const Order = require('../models/order'); // You'll need to create this model

exports.checkout = async (req, res) => {
    try {
      const { name, email, address } = req.body;
      
      // Find the existing cart
      const cart = await Cart.findOne().populate('items.productId');
  
      if (!cart || cart.items.length === 0) {
        return res.status(400).send('Cart is empty');
      }
  
      // Create an order (you'll need to create an Order model)
      const order = new Order({
        user: null, // Add user if you have authentication
        items: cart.items,
        total: cart.total,
        shippingInfo: {
          name,
          email,
          address
        },
        status: 'Pending'
      });
  
      await order.save();
  
      // Clear the cart after order creation
      cart.items = [];
      cart.total = 0;
      await cart.save();
  
      res.redirect('/orders/confirmation');
    } catch (err) {
      console.error('Checkout error:', err);
      res.status(500).send('Error processing checkout');
    }
  };