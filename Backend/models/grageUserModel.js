const mongoose = require("mongoose");

const grageSchema = mongoose.Schema({
  userName: {
    type: String,
    required: "Username is required",
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
});

const Grage = mongoose.model("Grage", grageSchema);

module.exports = Grage;
