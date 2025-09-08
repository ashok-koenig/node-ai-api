const express = require("express")
const { getAllTasks, getTaskById, createTask, updateTaskById, deleteTaskById } = require("../controllers/taskController")
const { validateTask } = require("../validations/taskValidation")
const { validationErrorHandler } = require("../middlewares/validationErrorHandler")

const taskRoutes = express.Router()


// Get all tasks
taskRoutes.get("/", getAllTasks)

// Get a task by id
taskRoutes.get("/:id", getTaskById)

// Create new task
taskRoutes.post("/", validateTask, validationErrorHandler, createTask)

// Update a task
taskRoutes.put("/:id", validateTask, validationErrorHandler, updateTaskById)

// Delete a task by id
taskRoutes.delete("/:id", deleteTaskById)

module.exports = taskRoutes