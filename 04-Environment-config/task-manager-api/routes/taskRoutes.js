const express = require("express")
const AppError = require("../errors/AppError")

const taskRoutes = express.Router()

let tasks = [
    {id: 1, title: "Task 1"},
    {id: 2, title: "Task 2"}
]

// Get all tasks
taskRoutes.get("/", (req, res)=> {
    res.json(tasks)
})

// Get a task by id
taskRoutes.get("/:id", (req, res, next)=> {
    const taskId  = req.params.id
    const task = tasks.find( task => task.id == taskId)
    if(task){
        res.json(task)
    }else{
        // res.status(404).json({error: "task not found"})
        return next(new AppError("Task not found", 404))
    }
})

// Create new task
taskRoutes.post("/", (req, res)=> {
    tasks.push(req.body)
    res.status(201).json(req.body)
})

// Update a task
taskRoutes.put("/:id", (req, res, next)=> {
    const taskId = req.params.id
    const task = tasks.find( task => task.id == taskId)
    if(task){
        tasks = tasks.map( task => {
            if(task.id == taskId){
                return req.body;
            }else {
                return task;
            }
        })

        res.json(req.body)
    }else{        
        return next(new AppError("Task not found", 404))
    }
})

// Delete a task by id
taskRoutes.delete("/:id", (req, res, next)=> {
    const taskId  = req.params.id
    const task = tasks.find( task => task.id == taskId)
    if(task){
        tasks = tasks.filter(task => task.id != taskId)
        res.sendStatus(204)
    }else{        
        return next(new AppError("Task not found", 404))
    }
})

module.exports = taskRoutes