const express = require('express')
const multer = require('multer')
const { validateUpload } = require('../middlewares/validateUpload')
const { analyzeImage } = require('../controllers/analyzeController')

const analyzeRoutes = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb)=> {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const uploadDisk = multer({storage})

analyzeRoutes.post("/", uploadDisk.single('image'), validateUpload(['image/png', 'image/jpeg', 'image/gif']), analyzeImage )

module.exports = analyzeRoutes