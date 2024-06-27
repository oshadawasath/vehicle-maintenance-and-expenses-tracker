const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect("mongodb+srv://devops663:cS3VonfdF2PYkn1O@cluster0.tdev0vt.mongodb.net/vehicle_maintance?retryWrites=true&w=majority")
    // .connect("mongodb://localhost:27017/vehicle_maintance")
    .then(() => {
      console.log("Connected mongo to Database");
    })
    .catch(() => {
      console.log("Connection failed!");
    });
};

module.exports = connect;
