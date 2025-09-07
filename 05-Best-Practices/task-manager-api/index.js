const express = require("express")
const cors = require("cors")
require('dotenv').config()

const taskRoutes = require("./routes/taskRoutes")
const errorHandler = require("./middlewares/errorHandler")
const logger = require("./middlewares/logger")

const PORT = process.env.PORT || 5000
const FRONTEND_URL = process.env.FRONTEND_URL || "*"

const app = express()

// Built-in Middlewares
app.use(express.json())
app.use(cors({origin: FRONTEND_URL}))

// Custom middlewares
app.use(logger)

app.use("/tasks", taskRoutes)

// Error handler
app.use(errorHandler)

app.listen(PORT, () => console.log("API running at port "+ PORT))