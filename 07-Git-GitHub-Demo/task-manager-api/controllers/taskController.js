const { ERROR_MESSAGE } = require("../constants/errorMessage")
const { STATUS_CODE } = require("../constants/statusCode")
const AppError = require("../errors/AppError")
const { allTasks, findTaskById, addTask, updateTask, removeATask } = require("../services/taskService")

exports.getAllTasks = (req, res)=> {
    res.json(allTasks())
}

exports.getTaskById = (req, res, next)=> {
    const taskId  = req.params.id
    const task = findTaskById(taskId)
    if(task){
        res.json(task)
    }else{        
        return next(new AppError(ERROR_MESSAGE.TASK_NOT_FOUND, STATUS_CODE.NOT_FOUND))
    }
}

exports.createTask = (req, res)=> {    
    res.status(STATUS_CODE.CREATED).json(addTask(req.body))
}

exports.updateTaskById = (req, res, next)=> {
    const taskId = req.params.id
    const task = findTaskById(taskId)
    if(task){
        res.json(updateTask(taskId, req.body))
    }else{        
        return next(new AppError(ERROR_MESSAGE.TASK_NOT_FOUND, STATUS_CODE.NOT_FOUND))
    }
}

exports.deleteTaskById = (req, res, next)=> {
    const taskId  = req.params.id
    const task = findTaskById(taskId)
    if(task){
        removeATask(taskId)
        res.sendStatus(STATUS_CODE.NO_CONTENT)
    }else{        
        return next(new AppError(ERROR_MESSAGE.TASK_NOT_FOUND, STATUS_CODE.NOT_FOUND))
    }
}