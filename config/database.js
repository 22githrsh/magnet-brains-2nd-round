const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connect = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Database connection failed:", err));
};

module.exports = { connect };
