const express = require("express");
const route = express.Router();
const auth = require("../middleware/auth");

//controller
const notificationController = require("../controller/notificationController");
// route.post("/displayAll", auth,notificationController.displayAllNotifications);
route.post("/displayAll",notificationController.displayAllNotifications);

route.post("/viewOne",auth, notificationController.viewOne);
route.post("/deleteOne", auth,notificationController.deleteOne);
route.post("/viewAll", auth,notificationController.viewAll);
route.post("/accept", auth,notificationController.acceptNotification);
route.post("/notificationIdentifiy",notificationController.notificationIdentify);


module.exports = route;


