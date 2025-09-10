const express = require("express")
const axios = require("axios")
const multer = require("multer")
require("dotenv").config()
const FormData = require("form-data")
const fs = require("fs")
const path = require("path")

const app = express()

app.use(express.json())

const OPENAI_WHISPER_URL = process.env.OPENAI_WHISPER_URL
const OPENAI_GPT_URL = process.env.OPENAI_GPT_URL
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const PORT = process.env.PORT || 3000

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
        const allowed= ["audio/mpeg", "audio/wav", "audio/x-wav", "audio/wave"]
        cb(null, allowed.includes(file.mimetype))
    }
})

// audio -> wishper (STT) -> GPT (Summary)

app.post("/smart-report", uploadDisk.single("audio"), (req, res)=>{
    if(!req.file){
        return res.status(400).json({error: "Audio file required"})
    }

    const filePath = path.resolve(req.file.path)
    const formData = new FormData()
    formData.append("file", fs.createReadStream(filePath))
    formData.append('model', 'whisper-1')

    // Step 1: Transcrition using whisper
    axios.post(
        OPENAI_WHISPER_URL,
        formData,
        {
            headers: {
                Authorization: `Bearer ${OPENAI_API_KEY}`,
                ...formData.getHeaders()
            }
        }
    ).then( WhisperResponse => {
        const transcription = WhisperResponse.data.text;

        // Step 2: Summarization using GPT

        axios.post(
            OPENAI_GPT_URL,
            {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are an assistant that summarizes meeting notes or audio transcriptions"
                    },
                    {
                        role: "user",
                        content: `Summarize this transcription: ${transcription}`
                    }
                ]
            },
            {
                headers: {Authorization: `Bearer ${OPENAI_API_KEY}`}
            }
        ).then(gptResponse => {
            const summary = gptResponse.data.choices[0].message.content
            // Remove the uploaded audio
            fs.unlinkSync(filePath)
            res.json({transcription, summary})
        })

    }).catch( error => {
        console.log("Whisper Error: ", error.message)
        res.status(500).json({error: "Failed to trascribe audio, please try again"})
    })
})

app.listen(PORT, ()=> console.log(`API running at port ${PORT}`))