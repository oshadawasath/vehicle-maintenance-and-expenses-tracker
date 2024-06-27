const express = require("express");
const route = express.Router();
const auth = require("../middleware/auth");

//controller
const maintainceController = require("../controller/maintanceController");
route.post("/addMiantainceDetails",auth, maintainceController.addMaintanceDetails);
route.post("/viewMaintaince", auth,maintainceController.viewMaintanceDetails);
route.post("/deleteMaintaince",auth, maintainceController.deleteMaintanceDetials);


module.exports = route;


