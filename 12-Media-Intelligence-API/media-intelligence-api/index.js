const express = require("express")
const axios = require("axios")
const multer = require("multer")
require("dotenv").config()
const FormData = require("form-data")
const fs = require("fs")
const path = require("path")

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 3000
const OPENAI_GPT_URL = process.env.OPENAI_GPT_URL
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_WHISPER_URL = process.env.OPENAI_WHISPER_URL

const upload = multer({dest: 'uploads/'})

app.post("/analyze-image", upload.single("image"), (req, res)=>{
    if(!req.file){
        return res.status(400).json({error: "Image file required"})
    }

    // Convert image to base64
    const base64 = fs.readFileSync(req.file.path , {encoding: 'base64'})

    axios.post(
        OPENAI_GPT_URL,
        {
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: "system",
                    content: "You are an image analysis assistant. Extract text and detext object or labels"
                },
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `Analyze this image. Return JSON strickly in format: {"text": string, "objects": string[], "labels": string[] }`
                        },
                        {
                            type: 'image_url',
                            image_url: {url: `data:image/jpeg;base64,${base64}`}
                        }
                    ]
                }
            ],
            max_tokens: 500
        },
        {
            headers: {Authorization: `Bearer ${OPENAI_API_KEY}`}
        }    
    ).then(response => {

        let resultRaw = response.data.choices[0].message.content.trim()
        // console.log(resultRaw)

        let result;
        try {
            result =  JSON.parse(resultRaw)
        } catch (error) {
            result = {raw: resultRaw}
        }
        res.json({result})
    }).catch(error => {
        console.log("Error: ", error.message)
        res.status(500).json({error: "Failed to analyze image"})
    })
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
        const allowed= ["audio/mpeg", "audio/wav", "audio/x-wav", "audio/wave"]
        cb(null, allowed.includes(file.mimetype))
    }
})

app.post("/transcribe-audio", uploadDisk.single("audio"), (req, res)=>{
    if(!req.file){
        return res.status(400).json({error: "Audio file required"})
    }

    const filePath = path.resolve(req.file.path)
    const formData = new FormData()
    formData.append("file", fs.createReadStream(filePath))
    formData.append('model', 'whisper-1')

    axios.post(
        OPENAI_WHISPER_URL,
        formData,
        {
            headers: {
                Authorization: `Bearer ${OPENAI_API_KEY}`,
                ...formData.getHeaders()
            }
        }
    ).then( response => {
        res.json({transcription: response.data.text})
    }).catch( error => {
        console.log("Whisper Error: ", error.message)
        res.status(500).json({error: "Failed to trascribe audio, please try again"})
    })
})

app.post("/summarize-transcript", (req, res)=> {
    const content = req.body.content

    if(!content){
        return res.status(400).json({error: "Transcript content is required"})
    }

    axios.post(
        OPENAI_GPT_URL,
        {
            model: "gpt-3.5-turbo",
            messages: [
                {role: "system", content: "You are a transcript summarizer to single line"},
                {role: "user", content: content}
            ],
            temperature: 0.5
        },
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            }
        }
    ).then( response => {
        console.log(response.data)
        const summary = response.data.choices[0].message.content
        res.json({summary})
    }).catch( error => {
        console.log("Error: ", error.message)
        res.status(500).json({error: "Failed to fetch GPT reponse, Please try again"})
    })
})

app.listen(PORT, ()=> console.log(`API running at port ${PORT}`))