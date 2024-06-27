const multer = require('multer');
const cloudinary = require("../utils/cloudenary");
const Maintenance = require("../models/maintanceModel");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");
const Grage = require("../models/grageUserModel");

const upload = require("../middleware/multer");


// imageTagValue is True => image display
// "              " False => doesnt display display
exports.grageUserTag = (req, res, next) => {
    console.log(req.body);
    console.log(req.body.data);
    try {
        // Use multer middleware to upload image
        upload.single("image")(req, res, async function (err) {
            if (err) {
                return res.status(400).json({
                    status: "error",
                    comment: "Error uploading image"
                });
            }

            // Check if the uploaded file is an image
            if (!req.file || !req.file.mimetype.startsWith('image')) {
                return res.status(400).json({
                    status: "error",
                    comment: "Uploaded file is not an image"
                });
            }

            const additionalData = JSON.parse(req.body.data);
            console.log('Additional data:', additionalData);

            const plateNo = additionalData.plateNo;
            console.log("Plate number:", plateNo);

            const userEmail = additionalData.userEmail;
            const userName = additionalData.userName;

            console.log("88 " + userEmail);

            try {
                // Check if the grage user exists in the database
                const grageUser = await Grage.findOne({ email: userEmail });
                if (!grageUser) {
                    return res.status(404).json({
                        status: "error",
                        comment: "Grage user not found with the provided email"
                    });
                }

                // Check if the user exists in the database
                const user = await User.findOne({ plateNo: plateNo });
                if (!user) {
                    return res.status(404).json({
                        status: "error",
                        comment: "User not found with the provided plate number"
                    });
                }

                // If multer upload successful, now upload to Cloudinary
                cloudinary.uploader.upload(req.file.path, { folder: "DriveLanka" }, async function (error, result) {
                    if (error) {
                        return res.status(500).json({
                            status: "error",
                            comment: "Error uploading image to Cloudinary"
                        });
                    }
                    console.log("waatha")
                    console.log(result.secure_url);
                    console.log("note: " + additionalData.note);
                    try {
                        // Create a new Maintenance object and save it to the database
                        const maintenance = new Maintenance({
                            plateNo: plateNo,
                            note: additionalData.note,
                            cost: additionalData.cost,
                            imageUrl: result.secure_url,
                            imageValueCheck: false,
                            userName:userName,
                            userEmail:userEmail
                        });
                        const savedMaintenance = await maintenance.save(); // Save the maintenance object and get the saved document
                        const maintenanceId = savedMaintenance._id; // Get the _id of the saved maintenance object

                        // If Maintenance save successful
                        // Return success response
                        console.log("hello " + maintenanceId);
                        try {
                            // create notification object
                            const notification = new Notification({
                                plateNo: plateNo,
                                note: additionalData.note,
                                notificationFlag: false,
                                maintanceId: maintenanceId, // Assign the maintenanceId to the notification,
                                userName:userName,
                                userEmail:userEmail

                            });
                            await notification.save();

                            return res.status(200).json({
                                status: "success",
                                comment: "Maintenance data saved successfully",
                                imageUrl: result.secure_url // Uploaded image URL
                            });
                        } catch (error) {
                            console.error("Error saving notification:", error);
                            console.log("1");

                            return res.status(500).json({
                                status: "error",
                                comment: "Error saving notification"
                            });
                        }


                    } catch (error) {
                        console.log("2");
                        return res.status(500).json({
                            status: "error",
                            comment: error.message
                        });
                    }
                });
            } catch (error) {
                return res.status(500).json({
                    status: "error",
                    comment: error.message
                });
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            comment: error.message
        });
    }
};




exports.grageUserTagRemove = (req, res, next) => {

}
