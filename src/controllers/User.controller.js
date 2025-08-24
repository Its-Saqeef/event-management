import {asyncHandler} from "../utils/AsyncHandler.js"
import User from "../models/User.models.js"
import Notification from "../models/Notification.models.js"
import ApiError from "../utils/ApiError.js"
import {uploadToCloudinary} from "../utils/Cloudinary.js"
import { sendEmail } from "../utils/Emailservice.js"

const registerUser = asyncHandler( async (req,res) => {
    const {name,email,password} = req.body
    const file = req.file
    if([email,password,name].some((field)=>field?.trim=== "")){
        throw new ApiError(400,"Fill all fields")
    }

    const userExists = await User.findOne({email})
    if(userExists){
        throw new ApiError(409,"User Already Exist")
    }

    let avatar = ""
    if(file){
        avatar = await uploadToCloudinary(file.path)
    }

    const user = await User.create({
        name : name,
        email : email,
        avatar : avatar.url,
        password : password
    })

    const createdUser= await User.findById(user._id).select("-password")
    if(!createdUser){
        throw new ApiError(500,"User registratin Failed")
    }

    await Notification.create({
        user : createdUser._id,
        message : "Welcome to EventHub 🎉 Your account has been created.",
    })

    await sendEmail(
    email,
    "Welcome to EventHub 🎉",
    "welcome", // template name (welcome.ejs)
    { name }
  )


    res.status(201).json({
        message : "User Registered",
        success : true,
        data : createdUser
    })
})

const loginUser=asyncHandler( async (req,res) => {
     const {email,password} = req.body

     if(!email){
        throw new ApiError(400,"Email Not Found")
     }

     const user = await User.findOne({email : email})
      if(!user){
        throw new ApiError(400,"User Not Found")
     }
     
    const passwordStatus=await user.isPasswordCorrect(password)
    if(!passwordStatus){
        throw new ApiError(400,"Invalid Password")
     }
    
    const token = user.generateToken()

    const loggedInUser = await User.findById(user._id).select("-password")

    const options = {
        httpOnly : true,
        secure : true
    }

    return res.status(200).cookie("Token",token,options).json({
        success : true,
        data : loggedInUser
    })
})

const logOutUser= (req,res)=>{
    res.clearCookie("Token", { httpOnly: true, secure: true });
  
  return res.status(200).json({ message: "Logged out successfully" });
}

export {
    registerUser,
    loginUser,
    logOutUser
}