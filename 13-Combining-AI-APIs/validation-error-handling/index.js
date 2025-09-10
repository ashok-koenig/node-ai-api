const express = require("express")
require("dotenv").config()
const axios = require("axios")
const { promptValidation } = require("./validations/promptValidation")
const { validationErrorHandler } = require("./middlewares/validationErrorHandler")
const { errorHandler } = require("./middlewares/errorHandler")

const PORT = process.env.PORT || 3000
const OPENAI_API_URL = process.env.OPENAI_API_URL
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

const app = express()
app.use(express.json())

app.post("/chat", promptValidation, validationErrorHandler, (req, res, next)=> {
    const prompt = req.body.prompt

    // if(!prompt){
    //     return res.status(400).json({error: "Prompt is required"})
    // }

    axios.post(
        OPENAI_API_URL,
        {
            model: "gpt-3.5-turbo",
            messages: [
                {role: "system", content: "You are a helpful assistant in English"},
                {role: "user", content: prompt}
            ],            
        },
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            }
        }
    ).then( response => {
        // console.log(response.data)
        const gptReply = response.data.choices[0].message.content
        res.json({reply: gptReply})
    }).catch( error => {
        next(error)
        // console.log("Error: ", error.message)
        // res.status(500).json({error: "Failed to fetch GPT reponse, Please try again"})
    })
})

app.use(errorHandler)

app.listen(PORT, ()=> console.log(`API running at port ${PORT}`))