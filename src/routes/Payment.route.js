import { Router } from "express";
import {stripePayment,stripeWebhook,myPayments} from "../controllers/Payment.controller.js"
import verifyJWT from "../middlewares/auth.middleware.js"
import express from "express"

const paymentRouter = Router()

/**
 * @openapi
 * /api/payments/create-checkout-session:
 *   post:
 *     summary: Create a Stripe checkout session
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Checkout session created
 */
paymentRouter.route("/create-checkout-session").post(verifyJWT,stripePayment)

/**
 * @openapi
 * /api/payments/webhook:
 *   post:
 *     summary: Stripe webhook endpoint
 *     tags:
 *       - Payments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook handled
 */
paymentRouter.route("/webhook").post(express.raw({ type: "application/json" }),stripeWebhook)

/**
 * @openapi
 * /api/payments/mypayments:
 *   get:
 *     summary: Get authenticated user's payments
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of payments
 */
paymentRouter.route("/mypayments").get(verifyJWT,myPayments)


export default paymentRouter