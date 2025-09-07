const express = require("express")
const { getAllTasks, getTaskById, createTask, updateTaskById, deleteTaskById } = require("../controllers/taskController")

const taskRoutes = express.Router()


// Get all tasks
taskRoutes.get("/", getAllTasks)

// Get a task by id
taskRoutes.get("/:id", getTaskById)

// Create new task
taskRoutes.post("/", createTask)

// Update a task
taskRoutes.put("/:id", updateTaskById)

// Delete a task by id
taskRoutes.delete("/:id", deleteTaskById)

module.exports = taskRoutes