const productsController = require("../controllers/productsController");
const route = require("express").Router();

route.get("/", productsController.getProducts);
route.post("/add", productsController.addProduct);
route.patch("/update/:id", productsController.updateProduct);

module.exports = route;
