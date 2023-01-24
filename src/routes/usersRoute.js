const { usersController } = require("../controllers");
const route = require("express").Router();

route.get("/", usersController.getData);
route.post("/register", usersController.register);
route.post("/login", usersController.login);

module.exports = route;
