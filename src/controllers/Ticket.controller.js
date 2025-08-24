import Ticket from "../models/Ticket.models.js"
import { asyncHandler } from "../utils/AsyncHandler.js"
import ApiError from "../utils/ApiError.js"
import Event from "../models/Event.models.js"
import Notification from "../models/Notification.models.js"
import { sendEmail } from "../utils/Emailservice.js"

const bookTicket = asyncHandler( async (req,res) => {
    const user = req.user
    if(!user){
        throw new ApiError(404,"Please Login")
    }

    const {eventId,tickets} = req.body    
    
    const isEventAvailable = await Event.findOne({_id : eventId,capacity : {$gt : 0}})
    if(!isEventAvailable){
        throw new ApiError(200,"Event Not Available")
    }

    const generateTicket = await Ticket.create({
        user : user._id,
        event : eventId,
        quantity : tickets
    })

      const event = await Event.findOneAndUpdate(
        { _id: eventId, capacity: { $gte: tickets } },
        { $inc: { capacity: -tickets } },
        { new: true }
    )

    const notification = await Notification.create({
      user : user._id,
      event : event._id,
      message : `You booked a ticket for ${event.title}.`
    })

    await sendEmail(
      user.email,
      "Your Ticket Booking Confirmation 🎟️",
      "booking",
      { name: user.name, eventTitle: event.title, eventDate: event.date, venue: event.venue, status: "confirmed" }
)


    return res.status(201).json({
        success : true,
        ticket : generateTicket
    })


})

const cancelTicket = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) {
    throw new ApiError(404, "Please Login")
  }

  const { eventId, tickets } = req.body
  
  const updatedTicket = await Ticket.findOneAndUpdate(
  {
    user: user._id,
    event: eventId,
    quantity: { $gte: tickets }
  },
  {
    $inc : {quantity : -tickets}
  },
  {
    new : true
  }
);

if (!updatedTicket) {
  throw new ApiError(404, "Not enough tickets to cancel");
} 

  const updatedEvent = await Event.findOneAndUpdate(
    { _id: eventId },
    { $inc: { capacity: tickets } },
    { new: true }
  )

  if (!updatedEvent) {
    throw new ApiError(404, "Event Not Found")
  }

  const notification = await Notification.create({
      user : user._id,
      event : updatedEvent._id,
      message : `You cancelled your ${tickets.length > 1 ? tickets.length + " tickets" : "ticket"} for ${updatedEvent.title}.`
    })


  return res.status(200).json({
    success: true,
    message: "Ticket cancelled successfully",
    remainingTickets: updatedTicket.quantity,
    updatedCapacity: updatedEvent.capacity
  });
});


export {
  bookTicket,
  cancelTicket
}