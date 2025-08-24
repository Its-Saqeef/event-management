import express from "express"
import {upload} from "../middlewares/multer.middleware.js"
import {registerUser,loginUser,logOutUser} from '../controllers/User.controller.js'

const userRouter = express.Router()

userRouter.route("/register").post(upload.single('avatar'),registerUser)
userRouter.route("/login").post(loginUser)
userRouter.route("/logout").post(logOutUser)


export default userRouter