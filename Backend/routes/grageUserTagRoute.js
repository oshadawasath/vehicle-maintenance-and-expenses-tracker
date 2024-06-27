const express = require("express");
const route = express.Router();
const auth = require("../middleware/auth");

//controller
const grageUserTagController = require("../controller/grageUserTagController");
const grageUserUserController = require("../controller/grageUserController");

route.post("/grageUserTag",auth, grageUserTagController.grageUserTag);
route.post("/grageUserTagRemove", grageUserTagController.grageUserTagRemove);
route.post("/grageRegister",grageUserUserController.grageRegister);
route.post("/grageLogin",grageUserUserController.grageRegisterLogin);


module.exports = route;
