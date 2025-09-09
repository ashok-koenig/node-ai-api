const express = require("express")
const axios = require("axios")
require("dotenv").config()

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 3000
const OPENAI_GPT_URL = process.env.OPENAI_GPT_URL
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

app.post("/analyze-text", (req, res)=>{
    const text = req.body.text
    if(!text){
        return res.status(400).json({error: "Text is required"})
    }

    axios.post(
        OPENAI_GPT_URL,
{
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are a linguistic analyzer. Return JSON with sentiment, entities, and syntax.'
          },
          {
            role: 'user',
            content: `Analyze the following text strictly in JSON format:
{text: "${text}"}

Format:
{
  "sentiment": "positive|negative|neutral",
  "entities": ["entity1", "entity2"],
  "syntax": [{"text":"noun"}, {"text":"verb"}, {"text":"adjective"}, ...]
}`
          }
        ],
        max_tokens: 300,
        temperature: 0.2
      },
        {
            headers: {Authorization: `Bearer ${OPENAI_API_KEY}`}
        }
    ).then(response => {
        let resultRaw = response.data.choices[0].message.content.trim();
        let result;

        try {
            result = JSON.parse(resultRaw)
        } catch (error) {
            result = {raw: resultRaw}
        }

        res.json({result})
    }).catch(error=>{
        console.log("Error: ", error.message)
        res.status(500).json({error: "Failed to analyze the text"})
    })
})

app.listen(PORT, ()=> console.log(`API running at port ${PORT}`))