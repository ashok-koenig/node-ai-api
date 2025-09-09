const express = require("express")
const multer = require("multer")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 3000

const upload = multer({dest: "uploads/"})

app.post("/upload", upload.single("file"), (req, res)=> {
    if(!req.file){
        return res.status(400).json({error: "File required"})
    }
    res.json({message: "File uploaded successfully"})
})

// Set up storage to disk
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const uploadDisk = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed= ["audio/mpeg", "audio/wav", "image/png", "image/jpeg"]
        cb(null, allowed.includes(file.mimetype))
    }
})

app.post("/upload-disk", uploadDisk.single("file"), (req, res)=>{
    if(!req.file){
        return res.status(400).json({error: "File required or unsupported file format"})
    }
    res.json({message: "File uploaded successfully", filename: req.file.filename})
})

// Setup storage to memory

const uploadMemory = multer({
    storage: multer.memoryStorage(),
     fileFilter: (req, file, cb) => {
        const allowed= ["audio/mpeg", "audio/wav", "image/png", "image/jpeg"]
        cb(null, allowed.includes(file.mimetype))
    }
})

app.post("/upload-memory", uploadMemory.single("file"), (req, res)=>{
    if(!req.file){
        return res.status(400).json({error: "File required or unsupported file format"})
    }
    res.json({
        message: "File uploaded to memory", 
        filename: req.file.originalname,
        bufferSize: req.file.buffer.length
    })
})

app.listen(PORT, ()=> console.log(`API running at port ${PORT}`))