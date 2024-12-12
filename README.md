E-Commerce Cart System
An E-Commerce web application that allows users to manage their cart by adding, removing, and viewing products. This project uses Node.js, Express, MongoDB, and EJS for templating.

Features
Add products to the cart.
Remove products from the cart.
Calculate the total price of items in the cart.
View the cart's contents dynamically.
Prerequisites
Ensure you have the following installed on your system:

Node.js (v12 or higher)
MongoDB (local or cloud-based)
Installation
1. Clone the Repository
bash
Copy code
git clone https://github.com/yourusername/ecommerce-cart-system.git
cd ecommerce-cart-system
2. Install Dependencies
bash
Copy code
npm install
3. Set Up MongoDB
Start your MongoDB server locally or use a cloud MongoDB service like MongoDB Atlas.
Ensure a database named ecommerce is created in MongoDB.
4. Seed Initial Data (Optional)
You can manually add products to the products collection in your database. Use the following sample schema:

json
Copy code
{
  "name": "Sample Product",
  "price": 19.99
}
Usage
1. Start the Application
bash
Copy code
npm start
The application will be accessible at http://localhost:3000.

2. Routes
Cart Routes
Route	Method	Description
/cart	GET	View cart contents.
/cart/add	POST	Add a product to the cart.
/cart/remove	POST	Remove a product from the cart.
Product Form
Use the dropdown in the web interface to add available products to your cart.
Technology Stack
Backend: Node.js, Express.js
Database: MongoDB
Frontend: EJS, Tailwind CSS
Templating: Embedded JavaScript (EJS)


How It Works
Add Products:

Users can select a product from the dropdown and specify the quantity.
Submitting the form sends a POST request to /cart/add.
View Cart:

The /cart route displays all products in the cart and their total cost.
Remove Products:

Users can remove products from the cart by submitting a POST request to /cart/remove.

