import { Router } from "express";
import {myNotifications} from "../controllers/Notification.controller.js"
import verifyJWT from "../middlewares/auth.middleware.js"

const notificationRouter = Router()

notificationRouter.route("/mynotifications").get(verifyJWT,myNotifications) 

export default notificationRouter;