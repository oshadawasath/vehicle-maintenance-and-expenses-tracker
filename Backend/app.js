const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoClient = require('./mongo-connection');
mongoClient();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit: '1mb'})); // file size change (when image upload size must increase)

// CORS middleware
app.use(cors());

const userRoute = require('./routes/user'); //user routing

const otpRoute = require('./routes/otpRoute'); //otp routing

const grageTagRoute = require("./routes/grageUserTagRoute");// tag route

const notificationRoute = require("./routes/notificationRoute");// notification route

const maintainceRoute = require("./routes/maintainceRoute");// notification route
const expenseRoute = require('./routes/expenseRoute'); //vehicleExpense -SF

//const mlRoute = require('../Backend\ML'); //vehicleExpense -SF



app.use('/api/v1/user', userRoute);
app.use('/api/v1/otp', otpRoute);
app.use('/api/v1/tag', grageTagRoute);

app.use("/api/v1/user", userRoute);
app.use("/api/v1/otp",otpRoute);
app.use("/api/v1/tag",grageTagRoute);
app.use("/api/v1/notification",notificationRoute);
app.use("/api/v1/maintaince",maintainceRoute);

app.use('/api/v1', expenseRoute); // Integrating the expense route -VehicleEpense-SF



module.exports = app;
