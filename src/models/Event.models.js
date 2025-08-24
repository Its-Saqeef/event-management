import mongoose,{ Schema,model } from "mongoose";

const eventSchema=new Schema({
    title : {
        type : String,
        required : [true,"Title of Event is required"],
        trim : true,
        index : true
    },
    slug : {
      type : String
    },
    description : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        required : true
    },
    venue: {
      type: String,
      required: true,
    },
    category: {
      type: String, 
      required: true,
    },
    poster: {
      type: String,
    },
    capacity: {
      type: Number,
      required: true,
    },
    ticketPrice: {
      type: Number,
      required: true,
      default: 0,
    },
     organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
},{timestamps : true})

export default model("Event",eventSchema)