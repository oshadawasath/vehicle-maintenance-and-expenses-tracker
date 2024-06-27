const User = require("../models/userModel");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const config=require("../config/config");

let storedOTP = null; // this is used identify the sended otp  

// Function to generate a random integer within a specific range
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}



exports.otpCheck = (req, res, next) => {
    const { email, plateNo, otpValue } = req.body;

    // Validate request body
    if (!email || !plateNo || !otpValue) {
        return res.status(400).json({
            status: "failed",
            comment: "Bad request. Missing required fields.",
            data: ""
        });
    }

    // Find user by email, plateNo, and check if OTP matches
    User.findOne({ plateNo: plateNo, email: email, storedOTP: otpValue })
        .then(user => {
            if (user) {
                // OTP is correct
                return res.status(200).json({
                    status: "success",
                    comment: "Success (correct OTP)",
                    data: ""
                });
            } else {
                // OTP is incorrect or user not found
                return res.status(500).json({
                    status: "failed",
                    comment: "Failed (incorrect OTP or user not found)",
                    data: ""
                });
            }
        })
        .catch(error => {
            // Error occurred during database query
            return res.status(500).json({
                status: "failed",
                comment: "Failed (error during OTP check)",
                data: ""
            });
        });
};
exports.otpSend = (req, res, next) => {
    const email = req.body.email;
    const plateNo = req.body.plateNo;

    if (!email || !plateNo) {
        return res.status(400).json({
            status: "failed",
            comment: "Failed to save userEmail and plate number are required",
            data: null,
        });
    }

    // Check if user exists with the provided email and plate number
    User.findOne({ email: email, plateNo: plateNo })
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    status: "failed",
                    comment: "User not found",
                    data: null,
                });
            }

            const randomNumber = getRandomInt(1000, 10000); // Generates a random integer between 1000 (inclusive) and 10000 (exclusive)
            console.log(randomNumber);

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "drivelanka2024@gmail.com",
                    pass: "icsc zllz cndd bdsg"
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            const mailOptions = {
                from: "drivelanka2024@gmail.com",
                to: email,
                subject: "Drive Lanka OTP ",
                text: `Your OTP is ${randomNumber}. This is only valid for 2 minutes` // Use template string to include randomNumber
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.error("Error occurred:", error.message);
                    return res.status(500).json({
                        status: "failed",
                        comment: "Failed to send email",
                        data: null
                    });
                } else {
                    console.log("Email sent successfully!");
                    console.log("Message ID:", info.messageId);
                 

                    // Save OTP in the database
                    User.findOneAndUpdate(
                        { email: email, plateNo: plateNo },
                        { $set: { storedOTP: randomNumber } },
                        { new: true, upsert: true }
                    )
                    .then(updatedUser => {

                        // Generate JWT token with 4-minute expiration
                        const token = jwt.sign({ plateNo: user.plateNo, email:user.email }, config.userToken, { expiresIn: '4m' });

                        return res.status(200).json({
                            status: "success",
                            comment: "Success Send Otp",
                            data: token, // Sending the generated token in the response
                        });
                    })
                    .catch(error => {
                        return res.status(500).json({
                            status: "failed",
                            comment: "Failed to save OTP",
                            data: null,
                        });
                    });
                }
            });
        })
        .catch(error => {
            return res.status(500).json({
                status: "failed",
                comment: "Error occurred while finding user",
                data: null,
            });
        });
};
