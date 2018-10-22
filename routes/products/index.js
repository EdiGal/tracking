const express = require("express");
const routes = express.Router()

const productLogic = require("../../logic/products/products")

routes.get("/", (req, res) => {
    let product = productLogic.getAllProducts();
    res.send(product);
})


module.exports = routes