const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true, unique: true }, // Specify unique and auto options for _id
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
    note: {
        type: String,
        required: [true, "Note is required"]
    },
    notificationFlag: {
        type: Boolean,
        default: true
    },
    viewFlag: {
        type: Boolean,
        default: true
    },
    maintanceId: {
        type: String, // Changed from Number to ObjectId
        ref: 'Maintenance', // References the Maintenance model
        required: [true, "Maintenance ID is required"]
    },
    userEmail: {
        type: String,
        required: "Email is required",
        minlength: 5,
        validate: {
          validator: function(v) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
          },
        }},
    date: {
        type: Date,
        default: Date.now() // Corrected to Date.now()
    },  userName: {
        type: String,
        required: "name is required",
        
      },
});

module.exports = mongoose.model("Notification", notificationSchema);
