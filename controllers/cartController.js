const mongoose = require('mongoose');
const Cart = require("../models/cart");
const Product = require("../models/product");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Display cart page with items
exports.getCart = async (req, res) => {
    try {
      let cart = await Cart.findOne().populate("items.productId");
      const products = await Product.find(); // Fetch all products for the dropdown
  
      // If no cart exists, create an empty cart
      if (!cart) {
        cart = { items: [], total: 0 };
      }
  
      const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = cart.total || 0;
  
      res.render('cart', {
        cartCount,
        totalAmount,
        cart,
        products, // Pass products to the view
        stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
      });
    } catch (err) {
      console.error('Error retrieving cart:', err);
      res.status(500).send('Error retrieving cart');
    }
  };

// Add product to cart

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).send('Product ID and quantity are required');
        }

        // Find the product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Find the user's cart or create a new one
        let cart = await Cart.findOne({ userId: req.user?._id });
        if (!cart) {
            cart = new Cart({ userId: req.user?._id, items: [], total: 0 });
        }

        // Check if the product is already in the cart
        const cartItem = cart.items.find(item => item.productId.toString() === productId);
        if (cartItem) {
            // Update quantity if product is already in the cart
            cartItem.quantity += parseInt(quantity, 10);
        } else {
            // Add the new product to the cart
            cart.items.push({ productId, quantity: parseInt(quantity, 10) });
        }

        // Update the cart total
        cart.total = cart.items.reduce((sum, item) => sum + item.quantity * product.price, 0);

        await cart.save();

        res.redirect('/cart');
    } catch (err) {
        console.error('Error adding to cart:', err);
        res.status(500).send('Internal server error');
    }
};
  
  
  exports.removeFromCart = async (req, res) => {
    try {
      const { productId } = req.body;
  
      // Validate product ID
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ 
          error: 'Invalid product ID',
          message: 'The provided product ID is not valid.'
        });
      }
  
      // Find the existing cart
      let cart = await Cart.findOne().populate('items.productId');
  
      // If no cart exists, return error
      if (!cart) {
        return res.status(404).json({ 
          error: 'Cart not found',
          message: 'No cart exists to remove items from.'
        });
      }
  
      // Find the index of the product in the cart
      const productIndex = cart.items.findIndex(
        (item) => item.productId._id.toString() === productId
      );
  
      // If product not found in cart, return error
      if (productIndex === -1) {
        return res.status(404).json({ 
          error: 'Product not in cart',
          message: 'The specified product is not in your cart.'
        });
      }
  
      // Remove the item from the cart
      cart.items.splice(productIndex, 1);
  
      // Recalculate total
      cart.total = cart.items.reduce((sum, item) => {
        return sum + (item.quantity * item.productId.price);
      }, 0);
  
      // Save the updated cart
      await cart.save();
  
      // Redirect back to cart page or send success response
      res.redirect('/cart');
    } catch (err) {
      console.error('Error removing from cart:', err);
      res.status(500).json({ 
        error: 'Server error',
        message: 'An unexpected error occurred while removing the item from the cart.'
      });
    }
  };




  exports.getCheckout = async (req, res) => {
    try {
        // Find the cart for the current user or session
        let cart = await Cart.findOne().populate('items.productId'); // Modify query if session/user is used

        // If no cart exists or the cart is empty
        if (!cart || cart.items.length === 0) {
            return res.render('checkout', {
                cart: { items: [] },
                totalAmount: 0,
                cartCount: 0,
                message: 'Your cart is empty. Please add items before checking out.',
            });
        }

        // Render the checkout page with the cart data
        res.render('checkout', {
            cart: cart,
            totalAmount: cart.total,
            cartCount: cart.items.length,
        });
    } catch (err) {
        console.error('Error in getCheckout:', err);

        // Handle error and render error page
        res.status(500).render('error', {
            message: 'An error occurred while processing the checkout page.',
            error: process.env.NODE_ENV === 'development' ? err : null,
        });
    }
};

exports.createCheckoutSession = async (req, res) => {
    try {
        const cart = await Cart.findOne().populate('items.productId'); // Fetch the cart
        if (!cart || cart.items.length === 0) {
            return res.status(400).send('Cart is empty');
        }

        // Prepare line items for Stripe Checkout
        const lineItems = cart.items.map((item) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.productId.name,
                },
                unit_amount: Math.round(item.productId.price * 100), // Convert price to cents
            },
            quantity: item.quantity,
        }));

        // Create a checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${req.protocol}://${req.get('host')}/success`,
            cancel_url: `${req.protocol}://${req.get('host')}/cancel`,
        });

        // Redirect to the Stripe checkout URL
        res.json({ id: session.id });
    } catch (err) {
        console.error('Stripe Checkout Error:', err);
        res.status(500).send('An error occurred while processing your request.');
    }
};

exports.processCheckout = async (req, res) => {
    try {
        // Add your checkout processing logic here
        // This might involve creating an order, clearing the cart, etc.
        res.redirect('/orders/confirmation');
    } catch (err) {
        console.error('Error processing checkout:', err);
        res.status(500).render('error', {
            message: 'An error occurred during checkout.',
            error: process.env.NODE_ENV === 'development' ? err : null
        });
    }
};
  