const User = require("../models/userModel");
const Grage = require("../models/grageUserModel");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const config=require("../config/config");

exports.grageRegister = (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      status: "failed",
      comment: "Invalid email address",
      data: null,
    });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({
      status: "failed",
      comment: "Password must be at least 6 characters long",
      data: null,
    });
  }

  // Check if the email already exists in the database
  Grage.findOne({ email: email })
    .then((existingUser) => {
      if (existingUser) {
        // If a user with the same email already exists, return an error
        return res.status(400).json({
          status: "failed",
          comment: "Email already registered",
          data: null,
        });
      } else {
        // If the email is not found in the database, hash the password and proceed with registration
        bcrypt.hash(password, saltRounds, function(err, hash) {
          if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).json({
              status: "failed",
              comment: "Failed to hash password",
              data: null,
            });
          }
          
          // Create a new Grage user using hashed password
          const newUser = new Grage({
            userName: username,
            password: hash,
            email: email,
          });

          // Save the new user to the database
          newUser.save()
            .then(() => {
              return res.status(200).json({
                status: "success",
                comment: "Registration successful",
                data: null,
              });
            })
            .catch((error) => {
              console.error('Error saving user:', error);
              return res.status(500).json({
                status: "failed",
                comment: "Failed to save user",
                data: null,
              });
            });
        });
      }
    })
    .catch((error) => {
      console.error('Error checking existing user:', error);
      return res.status(500).json({
        status: "failed",
        comment: "Failed to check existing user",
        data: null,
      });
    });
};


exports.grageRegisterLogin = (req, res, next) => {
  const { userName, password, email } = req.body; // Change variable name from plateNo to userName

  // Find the user in the database based on the provided email
  Grage.findOne({ email: email }) // Change field name from plateNo to email
    .then(user => {
      // If user not found, return failed status
      if (!user) {
        console.log("cannot find");
        return res.status(400).json({
          status: "failed",
          comment: "User not found",
          data: null,
        });
      }

      // Compare the provided password with the hashed password from the database
      bcrypt.compare(password, user.password, function(err, result) {
        if (err) {
          console.error('Error comparing passwords:', err);
          return res.status(300).json({
            status: "failed",
            comment: "Internal server error",
            data: null,
          });
        }

        // If passwords match, generate JWT token
        if (result) {
          // Generate JWT token with user's ID and userName as payload
          const token = jwt.sign({ userId: user._id, email: user.email }, config.userToken, { expiresIn: '1h' }); // Change field name from plateNo to email
          // Send the token in the response
          return res.status(200).json({
            status: "success",
            comment: "Login successful",
            data: { userName: user.userName, email: user.email }, // Include userName from the database
            token: token // Send the token in the response
          });
        } else {
          console.log("cannot find 1");

          // If password doesn't match, return failed status
          return res.status(300).json({
            status: "failed",
            comment: "Incorrect password",
            data: null,
          });
        }
      });
    })
    .catch(error => {
      console.error('Error finding user:', error);
      return res.status(300).json({
        status: "failed",
        comment: "Internal server error",
        data: null,
      });
    });
};
