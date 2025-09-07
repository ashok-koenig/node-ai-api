const express = require("express")

const userRoutes = express.Router()

// In-memmory user data
let users = [
    {id: 1, name: "John"},
    {id: 2, name: "Smith"}
]

// Get all users
userRoutes.get("/", (req, res)=> {
    res.json(users)
})

// Get an user by id
userRoutes.get("/:id", (req, res)=> {
    // console.log(req.params.id)
    let userId = req.params.id
    const user = users.find( user => user.id == userId)
    if(user){
        res.json(user)
    } else {
        res.status(404).json({error: "user not found"})
    }
})

// Create new user
userRoutes.post("/", (req, res)=>{
    // console.log(req.body)
    // res.send("User created...")
    users.push(req.body)
    res.status(201).json(req.body)
})

// Update an user
userRoutes.put("/:id", (req, res)=> {
    let userId = req.params.id
    const user = users.find(user => user.id == userId)
    if(user){
        users = users.map(user => {
            if(user.id == userId){
                return req.body
            }else {
                return user;
            }
        })
        res.json(req.body)
    }else{
        res.status(404).json({error: "user not found"})
    }
})

// Delete an user
userRoutes.delete("/:id", (req, res)=> {
    let userId = req.params.id
    const user = users.find( user => user.id == userId)
    if(user){
        users = users.filter( user => user.id != userId)
        res.sendStatus(204)
    } else {
        res.status(404).json({error: "user not found"})
    }
})

module.exports = userRoutes