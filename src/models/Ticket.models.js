import mongoose, { Schema,model } from "mongoose";

const ticketSchema=new Schema({
    qrCode : {
        type : String,
    },
    quantity : {
        type : Number,
        required : true        
    },
    status : {
        type : String,
        enum : ["booked", "paid", "checked-in", "cancelled"],
        default : "booked"
    },
    event : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Event",
        required : true
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
},{timestamps : true})

export default model("Ticket",ticketSchema)