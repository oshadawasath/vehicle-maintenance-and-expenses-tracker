const mongoose = require("mongoose");
const Notification = require("../models/notificationModel");
const User = require("../models/userModel");
const Maintenance = require("../models/maintanceModel");

exports.displayAllNotifications = (req, res, next) => {
    // Check if plateNo is provided in the request body
    if (!req.body.plateNo) {
        return res.status(400).json({
            status: "failed",
            comment: "plateNo is required in the request body",
            data: null,
        });
    }

    const plateNo = req.body.plateNo;

    // Find the user in the database based on the provided plateNo
    User.findOne({ plateNo: plateNo })
        .then(user => {
            // If user not found, return failed status
            if (!user) {
                return res.status(404).json({
                    status: "failed",
                    comment: "User not found",
                    data: null,
                });
            }

            // Find all notifications for the user and sort them by date field in descending order
            Notification.find({ plateNo: plateNo }).sort({ date: -1 })
                .then(notifications => {
                    return res.status(200).json({
                        status: "success",
                        comment: "Notifications retrieved successfully",
                        data: notifications,
                    });
                })
                .catch(error => {
                    console.error("Error retrieving notifications:", error);
                    return res.status(500).json({
                        status: "failed",
                        comment: "Failed to retrieve notifications",
                        data: null,
                    });
                });
        })
        .catch(error => {
            console.error("Error finding user:", error);
            return res.status(500).json({
                status: "failed",
                comment: "Failed to find user",
                data: null,
            });
        });
};

exports.viewOne = (req, res, next) => {
    // Check if plateNo and _id are provided in the request body
    if (!req.body.plateNo || !req.body._id) {
        return res.status(400).json({
            status: "failed",
            comment: "plateNo and _id are required",
            data: null,
        });
    }

    const plateNo = req.body.plateNo;
    const _id = req.body._id;

    // Find the user in the database based on the provided plateNo
    User.findOne({ plateNo: plateNo })
        .then(user => {
            // If user not found, return failed status
            if (!user) {
                return res.status(404).json({
                    status: "failed",
                    comment: "User not found",
                    data: null,
                });
            }

            // Find the notification in the database based on the provided _id and plateNo
            Notification.findOneAndUpdate({ plateNo: plateNo, _id: _id }, { viewFlag: false }, { new: true })
                .then(notification => {
                    if (!notification) {
                        return res.status(404).json({
                            status: "failed",
                            comment: "Notification not found",
                            data: null,
                        });
                    }

                    return res.status(200).json({
                        status: "success",
                        comment: "Notification retrieved and updated successfully",
                        data: notification,
                    });
                })
                .catch(error => {
                    console.error("Error updating notification:", error);
                    return res.status(500).json({
                        status: "failed",
                        comment: "Failed to update notification",
                        data: null,
                    });
                });
        })
        .catch(error => {
            console.error("Error finding user:", error);
            return res.status(500).json({
                status: "error",
                comment: "Failed to find user",
                data: null,
            });
        });
};



exports.deleteOne = async (req, res, next) => {
    try {
        // Check if plateNo and _id are provided in the request body
        const { plateNo, _id } = req.body;
        if (!plateNo || !_id) {
            return res.status(400).json({
                status: "error",
                comment: "plateNo and _id are required",
                data: null,
            });
        }

        // Find the user in the database based on the provided plateNo
        const user = await User.findOne({ plateNo });
        if (!user) {
            return res.status(404).json({
                status: "failed",
                comment: "User not found",
                data: null,
            });
        }

        // Delete all notifications in the database based on the provided _id and plateNo
        const deleteResult = await Notification.deleteMany({ plateNo, _id });
        if (deleteResult.deletedCount === 0) {
            return res.status(404).json({
                status: "failed",
                comment: "No notifications found for the provided _id and plateNo",
                data: null,
            });
        }

       

        return res.status(200).json({
            status: 'success',
            comment: 'Image value check updated successfully',
            data: null
        });
    } catch (error) {
        console.error("Error deleting notifications:", error);
        return res.status(500).json({
            status: "error",
            comment: "Failed to delete notifications",
            data: null,
        });
    }
};




exports.viewAll = (req, res, next) => {
    // Check if plateNo is provided in the request body
    if (!req.body.plateNo) {
        return res.status(400).json({
            status: "error",
            comment: "plateNo is required",
            data: null,
        });
    }

    const plateNo = req.body.plateNo;

    // Find the user in the database based on the provided plateNo
    User.findOne({ plateNo: plateNo })
        .then(user => {
            // If user not found, return failed status
            if (!user) {
                return res.status(404).json({
                    status: "failed",
                    comment: "User not found",
                    data: null,
                });
            }

            // Update all notifications in the database based on the provided plateNo
            Notification.updateMany({ plateNo: plateNo }, { notificationFlag: true })
                .then(result => {
                    if (result.nModified === 0) {
                        return res.status(404).json({
                            status: "failed",
                            comment: "No notifications found for the provided plateNo",
                            data: null,
                        });
                    }

                    return res.status(200).json({
                        status: "success",
                        comment: "Notifications updated successfully",
                        data: null,
                    });
                })
                .catch(error => {
                    console.error("Error updating notifications:", error);
                    return res.status(500).json({
                        status: "error",
                        comment: "Failed to update notifications",
                        data: null,
                    });
                });
        })
        .catch(error => {
            console.error("Error finding user:", error);
            return res.status(500).json({
                status: "error",
                comment: "Failed to find user",
                data: null,
            });
        });
};

// acceptNotification function
exports.acceptNotification = async (req, res, next) => {
    if (!req.body.plateNo || !req.body._id) {
       return res.status(400).json({
           status: "error",
           comment: "plateNo and _id are required",
           data: null,
       });
   }

   const plateNo = req.body.plateNo;
   const _id = req.body._id;

   try {
        // Find the user
        const user = await User.findOne({ plateNo: plateNo });
        if (!user) {
            return res.status(404).json({
                status: "failed",
                comment: "User not found",
                data: null,
            });
        }

        // Update the notificationFlag
        const notification = await Notification.findOneAndUpdate({ plateNo: plateNo, _id: _id }, { notificationFlag: true ,viewFlag:false}, { new: true });
        if (!notification) {
            return res.status(404).json({
                status: "failed",
                comment: "Notification not found",
                data: null,
            });
        }

        // Find the maintenance record
        const maintenanceRecord = await Maintenance.findOne({ _id: notification.maintanceId });
        if (!maintenanceRecord) {
            return res.status(404).json({
                status: 'failed',
                comment: 'No maintenance record found for the provided _id',
                data: null
            });
        }

        // Update the maintenance record
        maintenanceRecord.imageValueCheck = true;
        await maintenanceRecord.save();

        return res.status(200).json({
            status: 'success',
            comment: 'Image value check updated successfully',
            data: null
        });
   } catch (error) {
       console.error("Error accepting notification:", error);
       return res.status(500).json({
           status: "error",
           comment: "Failed to accept notification",
           data: null,
       });
   }
}



exports.notificationIdentify = async (req, res, next) => {
  const plateNo = req.body.plateNo;

  try {
    // Query the database to find if any document with the specified plateNo has viewFlag set to true
    const notification = await Notification.findOne({ plateNo: plateNo, viewFlag: true });

    if (notification) {
      // If a document with viewFlag set to true is found, return a success response
      return res.status(200).json({
        status: "success",
        message: "At least one notification found with viewFlag set to true",
        data: true // Return the found notification document if needed
      });
    } else {
      // If no document with viewFlag set to true is found, return a not found response
      return res.status(200).json({
        status: "failed",
        message: "No notification found with viewFlag set to true for the specified plate number",
        data: false
      });
    }
  } catch (error) {
    // If an error occurs during the database query, return a 500 status with the error message
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message
    });
  }
}

