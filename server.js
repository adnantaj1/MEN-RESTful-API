//import dependencies
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

// import routes
const productRoutes = require("./routes/product");
const authRoutes = require("./routes/auth");

require("dotenv-flow").config();
app.use(bodyParser.json());

// Connecting with MongoDB
mongoose.connect(
    process.env.DBHOST
).catch(()=> console.log("Error Connecting to MongoDB"));
mongoose.connection.once('open', () => console.log("Connected Successfully to MongoDB"))

// CRUD Routes 
app.use("/api/products", productRoutes);
app.use("/api/user", authRoutes);
app.get("/api/welcome", (req, res) =>{
    res.status(200).send({message: "Welcome to MEN RESTful API"})
})

// Connecting to server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Server is listening on port: " + PORT));

module.exports = app;