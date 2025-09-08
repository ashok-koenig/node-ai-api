
let tasks = [
    {id: 1, title: "Task 1"},
    {id: 2, title: "Task 2"}
]

exports.allTasks = () => tasks

exports.addTask = (newTask )=> {
    tasks.push(newTask)
    return newTask;
}

exports.findTaskById = (taskId) => tasks.find(task => task.id == taskId)

exports.updateTask = (taskId, editedTask) =>{
    tasks = tasks.map(task => {
        if(task.id == taskId){
            return editedTask;
        }else{
            return task
        }
    })
    return editedTask
}

exports.removeATask = (taskId) => {
    tasks = tasks.filter( task => task.id != taskId) 
}