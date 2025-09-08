const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
require('dotenv').config()

const taskRoutes = require("./routes/taskRoutes")
const errorHandler = require("./middlewares/errorHandler")
const logger = require("./middlewares/logger")

const PORT = process.env.PORT || 5000
const FRONTEND_URL = process.env.FRONTEND_URL || "*"
const corsOptions = {
    origin: FRONTEND_URL, 
    methods: ["GET", "POST", "PUT", "DELETE"]
}

const app = express()

// Built-in Middlewares
app.use(express.json())

const apiLimiter = rateLimit({
    windowMs: 5 * 1000, // 5 seconds
    max: 5,
    message: "Too many requests from this IP, please try gain later.",
    standardHeaders: true,
    legacyHeaders: false
})

app.use("/", apiLimiter)

app.use(cors(corsOptions))
app.use(helmet())
// app.use(helmet({contentSecurityPolicy: false}))

// Custom middlewares
app.use(logger)

app.use("/tasks", taskRoutes)

// Error handler
app.use(errorHandler)

app.listen(PORT, () => console.log("API running at port "+ PORT))