const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const cartSchema = new mongoose.Schema(
  {
    items: {
      type: [cartItemSchema],
      validate: {
        validator: function (items) {
          const productIds = items.map((item) => item.productId.toString());
          return new Set(productIds).size === productIds.length; // No duplicates
        },
        message: 'Duplicate products are not allowed in the cart.',
      },
    },
    total: {
      type: Number,
      default: 0,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Set true if the cart is tied to a user
    },
  },
  { timestamps: true }
);

cartSchema.index({ userId: 1 });

// Pre-save hook to calculate the total
cartSchema.pre('save', async function (next) {
  const cart = this;
  await cart.populate('items.productId'); // Ensure product details are loaded
  cart.total = cart.items.reduce((sum, item) => {
    return sum + item.quantity * item.productId.price;
  }, 0);
  next();
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
