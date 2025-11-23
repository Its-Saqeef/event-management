import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js"
import {bookTicket,cancelTicket} from "../controllers/Ticket.controller.js"

const ticketRouter = Router()

/**
 * @openapi
 * /api/tickets:
 *   post:
 *     summary: Book a ticket
 *     tags:
 *       - Tickets
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Ticket booked
 */
ticketRouter.route("/").post(verifyJWT,bookTicket)

/**
 * @openapi
 * /api/tickets:
 *   delete:
 *     summary: Cancel a ticket
 *     tags:
 *       - Tickets
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ticketId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ticket canceled
 */
ticketRouter.route("/").delete(verifyJWT,cancelTicket)

export default ticketRouter;