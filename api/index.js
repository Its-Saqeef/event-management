import dotenv from 'dotenv'

import ConnectDb from '../src/database/index.js'
import app from '../src/App.js'

dotenv.config()

ConnectDb()
.then(()=>{
app.listen(process.env.PORT || 4000,()=>`Server started at port ${process.env.PORT}`)
})
.catch((error)=>{
    console.log("MongoDB connection failed",error)
})


