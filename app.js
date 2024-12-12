const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");
const database = require("./config/database");
const cookieParser = require('cookie-parser');


dotenv.config();

const app = express();


// Database Connection
database.connect();

// Middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// Routes
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/", cartRoutes);

app.use("/orders", orderRoutes);
app.use((req, res) => {
    res.status(404).send('Page not found');
  });

app.get("/", (req, res) => {
    res.redirect("/product`");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));  