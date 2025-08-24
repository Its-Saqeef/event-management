import { Router } from "express";
import {stripePayment,stripeWebhook,myPayments} from "../controllers/Payment.controller.js"
import verifyJWT from "../middlewares/auth.middleware.js"
import express from "express"

const paymentRouter = Router()

paymentRouter.route("/create-checkout-session").post(verifyJWT,stripePayment)
paymentRouter.route("/webhook").post(express.raw({ type: "application/json" }),stripeWebhook)
paymentRouter.route("/mypayments").get(verifyJWT,myPayments)


export default paymentRouter