const Order = require("../models/order");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.checkout = async (req, res) => {
  try {
    const cart = await Cart.findOne();
    if (!cart || cart.items.length === 0) {
      return res.redirect("/cart");
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: cart.items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: { name: item.productId.name },
          unit_amount: item.productId.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${req.protocol}://${req.get("host")}/orders/success`,
      cancel_url: `${req.protocol}://${req.get("host")}/orders/failure`,
    });

    res.redirect(session.url);
  } catch (err) {
    res.status(500).send("Error during checkout");
  }
};

exports.paymentSuccess = async (req, res) => {
  try {
    // Logic for successful payment
    res.render("success");
  } catch (err) {
    res.status(500).send("Error processing success");
  }
};

exports.paymentFailure = async (req, res) => {
  try {
    res.render("failure");
  } catch (err) {
    res.status(500).send("Error processing failure");
  }
};
