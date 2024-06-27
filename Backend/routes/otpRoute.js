const express = require("express");
const route = express.Router();
const auth = require("../middleware/auth");


const otpController  = require("../controller/otpController");
route.post("/otpSend",otpController.otpSend);
route.post("/otpCheck",auth,otpController.otpCheck);

module.exports= route;