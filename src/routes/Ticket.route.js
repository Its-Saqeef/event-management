import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js"
import {bookTicket,cancelTicket} from "../controllers/Ticket.controller.js"

const ticketRouter = Router()

ticketRouter.route("/").post(verifyJWT,bookTicket)
ticketRouter.route("/").delete(verifyJWT,cancelTicket)

export default ticketRouter;