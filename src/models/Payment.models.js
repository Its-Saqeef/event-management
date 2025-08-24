import mongoose, { Schema, model } from "mongoose";

const paymentSchema = new Schema({
  user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true 
    },
  event: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Event", 
    required: true 
    },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
    required: true,
    },
  amount: { 
    type: Number, 
    required: true 
    },
  status: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  transactionId: { 
    type: String 
},
},{timestamps : true});

export default model("Payment", paymentSchema);
