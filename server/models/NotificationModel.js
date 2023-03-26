import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        content: {
            type: String,
        },
    },
    { timestamps: true }
);

const NotificationModel = mongoose.model("Notification", notificationSchema);
export default NotificationModel;

// timestamps: true sẽ tự động thêm 2 field createdAt và updatedAt vào schema
