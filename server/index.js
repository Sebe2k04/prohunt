const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");

// Routes
app.use("/auth", authRoutes);
// app.use('/users', require('./routes/users'));
// app.use('/products', require('./routes/products'));
// app.use('/cart', require('./routes/cart'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
