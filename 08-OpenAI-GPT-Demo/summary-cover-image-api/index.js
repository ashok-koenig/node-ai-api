const express = require("express")
require("dotenv").config()
const axios = require("axios")

const PORT = process.env.PORT || 3000
const OPENAI_GPT_URL = process.env.OPENAI_GPT_URL
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_DALL_E_URL = process.env.OPENAI_DALL_E_URL

const app = express()
app.use(express.json())

app.post("/blog-summary", (req, res)=> {
    const content = req.body.content

    if(!content){
        return res.status(400).json({error: "Blog content is required"})
    }

    axios.post(
        OPENAI_GPT_URL,
        {
            model: "gpt-3.5-turbo",
            messages: [
                {role: "system", content: "You are a blog summarizer to two line."},
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

app.post("/image-cover", (req, res)=>{
    const prompt = req.body.prompt

    if(!prompt){
        return res.status(400).json({error: "Prompt is required"})
    }

    axios.post(
        OPENAI_DALL_E_URL,
        {
            prompt,
            n:1,
            size: "1024x1024",
            response_format:"url"
        },
        {
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            }
        }
    ).then( response => {
        console.log(response.data)
        const imageURL = response.data.data[0].url
        res.json({imageURL})
    }).catch(error => {
        console.error("Error: ", error.message)
        res.status(500).json({error: "Failed to generate image, please try again"})
    })
})

app.listen(PORT, ()=> console.log(`API running at port ${PORT}`))