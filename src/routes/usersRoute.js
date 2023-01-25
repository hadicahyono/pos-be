const { readToken } = require("../configs/encrypt");
const { usersController } = require("../controllers");
const route = require("express").Router();

route.get("/", usersController.getData);
route.post("/register", usersController.register);
route.post("/login", usersController.login);
route.patch("/verify", readToken, usersController.verifyAccount);
route.get("/keep", readToken, usersController.keepLogin);

module.exports = route;
