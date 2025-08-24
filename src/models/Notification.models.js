import mongoose, { Schema,model } from "mongoose";

const notificationSchema=new Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    type: { 
      type: String, 
      enum: ["reminder", "booking", "system"], 
      default: "system" },
}, { timestamps: true })

export default model("Notification",notificationSchema)