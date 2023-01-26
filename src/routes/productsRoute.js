const productsController = require("../controllers/productsController");
const route = require("express").Router();

route.get("/", productsController.getMenus);

module.exports = route;
