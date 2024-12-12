const Product = require("../models/product");
const Cart = require("../models/cart");  // Ensure this line is present

exports.getAllProducts = async (req, res) => {
  try {
    // Check if there are any products in the database
    let products = await Product.find();

    // If no products are found, insert demo data
    if (products.length === 0) {
      products = [
        {
          name: "Demo Product 1",
          price: 19.99,
          image: "https://via.placeholder.com/300",
          description: "This is a demo product."
        },
        {
          name: "Demo Product 2",
          price: 29.99,
          image: "https://via.placeholder.com/300",
          description: "This is another demo product."
        },
        {
          name: "Demo Product 3",
          price: 39.99,
          image: "https://via.placeholder.com/300",
          description: "Yet another demo product."
        }
      ];

      // Insert demo products into the database
      await Product.insertMany(products);
    }

    // Retrieve the cart from the database
    const cart = await Cart.findOne();
    const cartCount = cart ? cart.items.length : 0;  // If cart exists, get the item count, else 0

    // Render the products page and pass products and cartCount to the view
    res.render("index", { products, cartCount });
  } catch (err) {
    console.error("Error retrieving products:", err);
    res.status(500).send("Error retrieving products");
  }
};
