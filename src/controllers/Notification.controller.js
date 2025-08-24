import Notification from "../models/Notification.models.js"
import {asyncHandler} from "../utils/AsyncHandler.js"
import ApiError from "../utils/ApiError.js"

const myNotifications = asyncHandler(async (req,res) => {
    const user = req.user
    if(!user){
        throw new ApiError(404,"User not found")
    }

    const allNotifications = await Notification.find({user : user._id}).sort({createdAt : -1})
    if(!allNotifications){
        throw new ApiError(404,"No notifications for this user")
    }

    return res.status(200).json({
        success : true,
        notifications : allNotifications
    })
})


export {
    myNotifications
}