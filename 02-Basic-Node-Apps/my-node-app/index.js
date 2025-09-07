const express = require("express")

const app = express()

app.get("/", (req, res) => {
    res.send("First app using Express")
})

app.get("/about", (req, res)=> {
    res.send("This is about page")
})

app.get("/contact", (req, res)=>{
    res.send("This is contact page")
})

app.listen(3000, ()=> console.log("API server is running at port 3000"))