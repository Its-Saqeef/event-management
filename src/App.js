import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import swaggerUi from "swagger-ui-express"
import swaggerJSDoc from "swagger-jsdoc"

const app=express()
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials: true
}))


app.use(express.json({limit : '16kb'}))
app.use(express.urlencoded({extended : true}))
app.use(express.static('public'))
app.use(cookieParser())


app.on("error",(err)=>{
    console.log("Error Creating App",err)
    throw Error(err)
})

app.get("/",(req,res)=>{
    res.status(200).json({
        message : "Welcome to Event Management API"
    })
})

// --- Swagger setup ---
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Event Management API',
        version: '1.0.0',
        description: 'API documentation for the Event Management Platform',
    },
    servers: [
        {
            url: process.env.CLIENT_URL || `http://localhost:${process.env.PORT || 4000}`,
        },
    ],
}

const swaggerOptions = {
    swaggerDefinition,
    apis: ['./src/routes/*.js','./src/controllers/*.js'],
}

const swaggerSpec = swaggerJSDoc(swaggerOptions)

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.get('/api/docs.json', (req, res) => res.json(swaggerSpec))



//routes import
import userRouter from "./routes/User.route.js"
import eventRouter from "./routes/Event.route.js"
import ticketRouter from "./routes/Ticket.route.js"
import paymentRouter from "./routes/Payment.route.js"
import notificationRouter from "./routes/Notification.route.js"


//routes declaration
app.use("/api/users",userRouter)
app.use("/api/events",eventRouter)
app.use("/api/tickets",ticketRouter)
app.use("/api/payments",paymentRouter)
app.use("/api/notifications",notificationRouter)

export default app;