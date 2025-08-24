import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/AsyncHandler.js"
import ApiError from "../utils/ApiError.js"
import User from "../models/User.models.js"

const verifyJWT = asyncHandler(async (req,res,next) => {
    const token = req.cookies?.Token || req.header("Authorization")?.split(" ")[1]

    if(!token){
        throw new ApiError(400,"Please Login")
    }
    
    const decodedValue = jwt.verify(token,process.env.JWT_TOKEN)

    const user =await User.findById(decodedValue?._id).select("-password")
    if(!user){
        throw new ApiError(400,"User not found")
    }
    
    req.user=user
    next()
})

export default verifyJWT