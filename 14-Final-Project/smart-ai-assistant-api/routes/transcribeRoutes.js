const express = require('express')
const multer = require('multer')
const { validateUpload } = require('../middlewares/validateUpload')
const { transcribe } = require('../controllers/transcribeController')

const transcribeRoutes = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb)=> {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const uploadDisk = multer({storage})

transcribeRoutes.post("/", uploadDisk.single('audio'), validateUpload(['audio/mpeg', 'audio/wav', 'audio/wave']), transcribe )

module.exports = transcribeRoutes