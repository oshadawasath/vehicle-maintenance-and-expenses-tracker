const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Import bcrypt for password comparison
const User = require('../models/userModel'); // Import the User model
const config=require("../config/config");
const authenticationMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization']; // Get the 'authorization' header
    console.log(req.headers)

    // Check if the authorization header exists
    if (!authHeader) {
        return res.status(401).json({
            status: "failed",
            comment: "No token provided",
            data: null
        });
    }

    // Check if the authorization header starts with 'Bearer'
    if (!authHeader.startsWith('Bearer')) {
        return res.status(401).json({
            status: "failed",
            comment: "Invalid authorization header format",
            data: null
        });
    }

    // Extract the token from the authorization header
    const token = authHeader.split(' ')[1];

    // Verify and decode the token
    jwt.verify(token, config.userToken, (err, decoded) => {
        if (err) {
            // Token verification failed
            console.error('Error verifying token:', err.message);
            return res.status(401).json({
                status: "failed",
                comment: "Invalid token",
                data: null
            });
        } else {
            // Token verification successful, 'decoded' will contain the decoded payload
            console.log('Decoded token:', decoded);
            // Set the userId in the request object
            req.userId = decoded.userId;
            next(); // Proceed to the next middleware
        }
    });
};

module.exports = authenticationMiddleware;
