import { Schema,model } from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const userSchema=new Schema({
    name : {
        type : String,
        required : [true,"Name is Required"],
        trim : true
    },
    email : {
        type : String,
        unique : true,
        required : true,
        lowercase : true,
        index : true
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type :String,
        enum : ["attendee", "organizer", "admin"],
        default : "attendee"
    },
    avatar : {
        type : String //url received from Cloudinary
    }
},{timestamps : true})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next()

    this.password =await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect=async function (password){
    if(!password){
        throw Error("Enter Password")
    }
   return await bcrypt.compare(password,this.password)   
}

userSchema.methods.generateToken=function (){
    return jwt.sign({
        _id : this._id,
        email : this.email,
        role : this.role
    },process.env.JWT_TOKEN,{
        expiresIn : "3d"
    })
}

export default model("User",userSchema)