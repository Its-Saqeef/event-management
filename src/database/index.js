import mongoose from "mongoose";
import {DB_NAME} from "../constants.js"

async function ConnectDb(){
    try {
        const isConnected=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected at host ${isConnected.connection.host}`)
    } catch (error) {
        console.log("MongoDB Connection Failed",error)
        process.exit(1)
    }
}

export default ConnectDb;