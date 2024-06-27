const mongoose = require("mongoose");

const maintenanceSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true, unique: true },
  plateNo: {
    type: String,
    required: [true, "Plate number is required"],
    validate: {
      validator: function(v) {
        return /^[A-Za-z0-9]+$/.test(v);
      },
      message: props => `${props.value} is not a valid plate number!`
    }
  },
  note:{
    type: String, 
    required: [true, "Note is required"],
  },
  cost:{
    type: Number,
    default: 0, 
  },
  imageUrl:{
    type: String,
    required: [true, "Image is required"],
  }, 
  userName: {
    type: String,
    default: "you", // Set default value to "you"
    
  },userEmail: {
    type: String,
    required: "Email is required",
    default: "your mail", // Set default value to "you"

  },
  imageValueCheck:{
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Maintenance", maintenanceSchema);
