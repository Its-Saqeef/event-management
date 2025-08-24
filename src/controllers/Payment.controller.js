import { asyncHandler } from "../utils/AsyncHandler.js";
import Stripe from "stripe";
import Ticket from "../models/Ticket.models.js";
import Payment from "../models/Payment.models.js";
import ApiError from "../utils/ApiError.js";
import Notification from "../models/Notification.models.js"

  const stripe = new Stripe(process.env.STRIPE_APIKEY);


const stripePayment = asyncHandler(async (req, res) => {

  const user = req.user
  if(!user){
    throw new ApiError(404,"User not found,Please login")
  }
  const { ticketId } = req.query

  const ticket = await Ticket.findById(ticketId).populate("event")

  if (!ticket) {
    throw new ApiError(404, "Ticket not found")
  }

  if (ticket.user.toString() !== user._id.toString()) {
    throw new ApiError(403, "You do not own this ticket")
  }

  const amount = ticket.event.ticketPrice * ticket.quantity * 100

  const payment = await Payment.create({
    user: user._id,
    event: ticket.event._id,
    ticket: ticket._id,
    amount: amount / 100,
    status: "pending",
  })

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "pkr",
          product_data: {
            name: ticket.event.title,
          },
          unit_amount: ticket.event.ticketPrice * 100,
        },
        quantity: ticket.quantity,
      },
    ],
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/payments/cancel`,
    metadata: {
      paymentId: payment._id.toString(),
      ticketId: ticket._id.toString(),
      userId: user._id.toString(),
    },
  })


  return res.status(200).json({
    success: true,
    id: session.id,
    url: session.url
  })
})

const stripeWebhook = asyncHandler(async (req, res) => {
  
  const sig = req.headers["stripe-signature"];
  let event;


  try {
    event = stripe.webhooks.constructEvent(
      req.body, // raw body
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const transactionId = session.payment_intent;
    const paymentId = session.metadata?.paymentId;

    const payment = await Payment.findById(paymentId).populate("event").populate("user","name email")
    if (payment) {
      payment.status = "paid"
      payment.transactionId = transactionId
      await payment.save()

      await Notification.create({
        user : payment.user,
        event : payment.event,
        message : `Your payment of ${payment.amount} for ${payment.event.title} was successful.`
      })
      console.log("✅ Payment updated:", payment._id)
      await sendEmail(
        payment.user.email,
        "Payment Receipt 💳",
        "receipt",
        { name: payment.user.name, eventTitle: payment.event.title, amount: payment.amount, transactionId: payment.transactionId }
      )
    } else {
      console.warn("⚠️ Payment not found for ID:", paymentId)
    }
  }

  


  return res.json({ received: true });
})

const myPayments = asyncHandler(async (req,res) => {
    const user = req.user
    if(!user){
      throw new ApiError(404,"User not found")
    }
    const allPaymenstofUser = await Payment.find({user : user._id}).populate("event")
    if(!allPaymenstofUser){
      throw new ApiError(404,"This user has no payments")
    }

    return res.status(200).json({
      success : true,
      allPayments : allPaymenstofUser
    })  
})


export { 
  stripePayment,
  stripeWebhook,
  myPayments
}
