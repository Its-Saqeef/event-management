import express from "express"
import {upload} from "../middlewares/multer.middleware.js"
import {registerUser,loginUser,logOutUser} from '../controllers/User.controller.js'

const userRouter = express.Router()

/**
 * @openapi
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Bad request
 */
userRouter.route("/register").post(upload.single('avatar'),registerUser)

/**
 * @openapi
 * /api/users/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in
 *       401:
 *         description: Unauthorized
 */
userRouter.route("/login").post(loginUser)

/**
 * @openapi
 * /api/users/logout:
 *   post:
 *     summary: Logout user
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Logged out
 */
userRouter.route("/logout").post(logOutUser)


export default userRouter