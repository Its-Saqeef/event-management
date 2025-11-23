import {Router} from "express"
import { upload } from "../middlewares/multer.middleware.js"
import {createEvent,listAllEvents,listOneEvent,eachOrganizerEvents,deleteEvent,updateEvent} from "../controllers/Event.controller.js"
import verifyJWT from "../middlewares/auth.middleware.js"

const eventRouter = Router()

/**
 * @openapi
 * /api/events/my-events:
 *   get:
 *     summary: Get events for authenticated organizer
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of organizer events
 */
eventRouter.route("/my-events").get(verifyJWT,eachOrganizerEvents)

/**
 * @openapi
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               poster:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Event created
 */
eventRouter.route("/").post(upload.single("poster"),verifyJWT,createEvent)

/**
 * @openapi
 * /api/events:
 *   get:
 *     summary: List all events
 *     tags:
 *       - Events
 *     responses:
 *       200:
 *         description: List of events
 */
eventRouter.route("/").get(listAllEvents)

/**
 * @openapi
 * /api/events/{slug}:
 *   get:
 *     summary: Get single event by slug
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event object
 */
eventRouter.route("/:slug").get(listOneEvent)

/**
 * @openapi
 * /api/events/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 */
eventRouter.route("/:id").delete(verifyJWT,deleteEvent)

/**
 * @openapi
 * /api/events/{id}:
 *   put:
 *     summary: Update an event
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Updated
 */
eventRouter.route("/:id").put(verifyJWT,updateEvent)

export default eventRouter

