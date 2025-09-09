const express = require("express")
const multer = require("multer")
const axios = require("axios")
require("dotenv").config()
const fs = require("fs")

const app = express()

const PORT = process.env.PORT || 3000
const OPENAI_GPT_URL = process.env.OPENAI_GPT_URL
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

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
        console.log(resultRaw)

        res.json({result: JSON.parse(resultRaw)})
    }).catch(error => {
        console.log("Error: ", error.message)
        res.status(500).json({error: "Failed to analyze image"})
    })
})

app.listen(PORT, ()=> console.log(`API running at port ${PORT}`))