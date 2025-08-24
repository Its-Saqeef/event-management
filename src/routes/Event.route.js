import {Router} from "express"
import { upload } from "../middlewares/multer.middleware.js"
import {createEvent,listAllEvents,listOneEvent,eachOrganizerEvents,deleteEvent,updateEvent} from "../controllers/Event.controller.js"
import verifyJWT from "../middlewares/auth.middleware.js"

const eventRouter = Router()

eventRouter.route("/my-events").get(verifyJWT,eachOrganizerEvents)
eventRouter.route("/").post(upload.single("poster"),verifyJWT,createEvent)
eventRouter.route("/").get(listAllEvents)
eventRouter.route("/:slug").get(listOneEvent)
eventRouter.route("/:id").delete(verifyJWT,deleteEvent)
eventRouter.route("/:id").put(verifyJWT,updateEvent)

export default eventRouter

