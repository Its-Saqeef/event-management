import { Router } from "express";
import {myNotifications} from "../controllers/Notification.controller.js"
import verifyJWT from "../middlewares/auth.middleware.js"

const notificationRouter = Router()

/**
 * @openapi
 * /api/notifications/mynotifications:
 *   get:
 *     summary: Get user's notifications
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 */
notificationRouter.route("/mynotifications").get(verifyJWT,myNotifications) 

export default notificationRouter;