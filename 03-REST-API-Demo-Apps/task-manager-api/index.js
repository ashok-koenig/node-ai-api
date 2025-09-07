const express = require("express")
const cors = require("cors")
const taskRoutes = require("./routes/taskRoutes")
const errorHandler = require("./middlewares/errorHandler")
const logger = require("./middlewares/logger")

const app = express()

// Built-in Middlewares
app.use(express.json())
app.use(cors({origin: "http://example.com"}))

// Custom middlewares
app.use(logger)

app.use("/tasks", taskRoutes)

// Error handler
app.use(errorHandler)

app.listen(3000, () => console.log("API running at port 3000"))