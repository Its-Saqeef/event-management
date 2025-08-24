import { asyncHandler } from "../utils/AsyncHandler.js";
import {uploadToCloudinary} from "../utils/Cloudinary.js"
import Event from "../models/Event.models.js"
import Notification from "../models/Notification.models.js"
import Ticket from "../models/Ticket.models.js"
import ApiError from "../utils/ApiError.js";
import {sendEmail} from "../utils/Emailservice.js"

const createEvent = asyncHandler(async (req,res) => {
    const user = req.user
    if(!user){
        throw new ApiError(400,"User Not Found")
    }

    if(user.role !== "organizer"){
        throw new ApiError(403,"User Unauthorized")
    }

    const {title, date, venue, capacity, ticketPrice,description,category} = req.body
    const file = req.file
    const slug = title.replace(" ","-").toLowerCase()


    let posterUrl = ""
    if(file){
        posterUrl = await uploadToCloudinary(file.path)
    }

    const createdEvent = await Event.create({
        title,
        date,
        venue,
        capacity,
        category,
        ticketPrice,
        description,
        organizer : user._id,
        poster : posterUrl.url,
        slug : slug
    })

    await Notification.create({
        user : user._id,
        message : `You successfully created the event ${createdEvent.title}`,
        event : createdEvent._id,
    })

    return res.status(201).json({
        message : "Event Created",
        success : true,
    })
})

const listAllEvents = asyncHandler(async (req,res) => {
    const {category,date,search,page,limit}=req.query
    const skip = (page - 1) * limit
    
    const filters = {}
    if(category){
        filters.category = category
    }

    if(date){
        filters.date = date
    }

    if(search){
        filters.$or = [
            {title : {$regex : search , $options : 'i'}},
            {description : {$regex : search , $options : 'i'}}
        ]
    }

    const totalEvents = await Event.countDocuments()
    const currentEvents = await Event.find(filters).skip(skip).limit(limit)
    const totalPages = Math.ceil(totalEvents/limit)

    return res.status(200).json({
        success : true,
        data : currentEvents,
        pagination : {
            totalPages,
            currentPage : page,
            itemsPerPage : limit
        }
    })
})

const listOneEvent = asyncHandler(async (req,res) => {
    const {slug} = req.params

    const singleEvent = await Event.findOne({slug : slug})

    return res.status(200).json({
        success : true,
        data : singleEvent
    })
})

const eachOrganizerEvents=asyncHandler(async (req,res) => {
    const user=req.user

    if(!user){
        throw new ApiError(400,"User Not Found")
    }

    if(user.role !== "organizer"){
        throw new ApiError(403,"User Unauthorized")
    }
    
    const organizerEvents = await Event.find({organizer : user._id})

    return res.status(200).json({
        success : true,
        data : organizerEvents,
    })
})

const deleteEvent=asyncHandler(async (req,res) => {
    const user = req.user
    if(!user){
        throw new ApiError(400,"User Not Found")
    }

    if(user.role === "attendee" ){
        throw new ApiError(403,"User Unauthorized")
    }

    const {id} = req.params

    if(user.role === "organizer"){
       const event = await Event.findOneAndDelete({_id : id,organizer : user._id})
       if(event==null){
        throw new ApiError(403,"User Unauthorized")
       }

       const tickets = await Ticket.find({event : event._id}).populate("user", "email name")

       const notifications = tickets.map((ticket)=>({
            user : ticket._id,
            event : event._id,
            message : `Event ${event.title} has been canceled.`
       }))
       
       await Notification.insertMany(notifications)

       const emailPromises = tickets.map((ticket) =>
        sendEmail(
            ticket.user.email,
            `Cancellation Notice: ${event.title}`,
            "eventCancel",
            {
            name: ticket.user.name,
            eventTitle: event.title,
            eventDate: event.date.toLocaleString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            }),
            }
        )
    )
    await Promise.all(emailPromises)
    }
    
    
    if(user.role === "admin"){
        await Event.findByIdAndDelete({_id : id})
    }

    return res.status(200).json({
        success : true,
        message : "Event Deleted Successfully",
    })
})

const updateEvent = asyncHandler(async (req,res) => {
    const {id} = req.params
    const updates = req.body

    const user = req.user
    if(!user){
        throw new ApiError(400,"User Not Found")
    }

    if(user.role === "attendee"){
        throw new ApiError(403,"User Unauthorized")
    }

    if(user.role === "organizer"){
        const event = await Event.findOne({_id : id,organizer : user._id})
        if(!event){
            throw new ApiError(404,"No event found")
        }
        Object.keys(updates).forEach((key)=>{
        event[key]=updates[key]
        })
        const updatedEvent=await event.save()

        const tickets = await Ticket.find({ event: id }).populate("user", "email name");

        const notifications = tickets.map((ticket) => ({
            user: ticket.user._id,
            message: `Update: ${event.title} has new details (check date/venue).`,
            event: event._id
        }))

        await Notification.insertMany(notifications);

    
    const emailPromises = tickets.map((ticket) =>
      sendEmail(
        ticket.user.email,
        `Update for ${event.title}`,
        "eventUpdate", // your email template
        {
          name: ticket.user.name,
          eventTitle: event.title,
          eventDate: event.date.toLocaleString('en-Gb',{
            day : "2-digit",
            month: "2-digit",
            year : 'numeric',
            hour : "2-digit",
            minute : "2-digit",
            hour12 : true
          }),
          venue: event.venue
        }
      )
    );
    await Promise.all(emailPromises);

        return res.status(200).json({
        success : true,
        message : "Event Updated Successfully",
        updatedEvent
    })
    }

    const event = await Event.findById({_id : id})

    if(!event){
        throw new ApiError(404,"No event found")
    }

    Object.keys(updates).forEach((key)=>{
        event[key]=updates[key]
    })

    const updatedEvent=await event.save()

    return res.status(200).json({
        success : true,
        message : "Event Updated Successfully",
        updatedEvent
    })

    
})


export {
    createEvent,
    listAllEvents,
    listOneEvent,
    eachOrganizerEvents,
    deleteEvent,
    updateEvent
}