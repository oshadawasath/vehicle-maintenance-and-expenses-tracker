const express = require("express");
const route = express.Router();
const auth = require("../middleware/auth");
//controller
const userController = require("../controller/user");
const testController = require("../controller/test");
//middlewre
route.post("/register", userController.driverRegister);
route.post("/login", userController.driverLogin);
route.post("/changePassword",userController.passwordChange);
route.post("/test",auth,testController.test);
route.post("/changeAccount",auth,userController.accountChange);

module.exports = route;


