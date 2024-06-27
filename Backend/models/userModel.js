const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  plateNo: {
    type: String,
    required: "Plate number is required",
    unique: true, 
    validate: {
      validator: function(v) {
        // Validation functio check if plateNo consists of letter and number a mixed pattern
        return /^[A-Za-z0-9]+$/.test(v);
      },
      message: props => `${props.value} is not a valid plate number!`
    }
  },
  password: {
    type: String,
    required: "Password is required",
    minlength: 5,
  },
  email: {
    type: String,
    required: "Email is required",
    minlength: 5,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
    }
  },
  storedOTP: {
    type: Number,
    default: null 

  }
});

module.exports = mongoose.model("User", userSchema);
