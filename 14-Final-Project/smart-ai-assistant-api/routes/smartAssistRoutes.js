const express = require('express')
const multer = require('multer')
const { validateUpload } = require('../middlewares/validateUpload')
const { smartAssist } = require('../controllers/smartAssistController')

const smartAssistRoutes = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb)=> {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const uploadDisk = multer({storage})

smartAssistRoutes.post("/", uploadDisk.single('file'), validateUpload(['audio/mpeg', 'audio/wav', 'audio/wave','image/png', 'image/jpeg', 'image/gif']), smartAssist )

module.exports = smartAssistRoutes