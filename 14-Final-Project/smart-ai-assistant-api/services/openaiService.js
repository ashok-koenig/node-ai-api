const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
require('dotenv').config()

const OPENAI_GPT_URL = process.env.OPENAI_GPT_URL
const OPENAI_WHISPER_URL = process.env.OPENAI_WHISPER_URL
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

exports.getGPTResponse = async (prompt) => {
    const response = await axios.post(
        OPENAI_GPT_URL,
        {
            model: 'gpt-3.5-turbo',
            messages: [{role: "user", content: prompt}]
        },
        {
            headers: {Authorization: `Bearer ${OPENAI_API_KEY}`}
        }
    )

    return response.data.choices[0].message.content
}

exports.getAudioTranscript = async (audioPath) =>{
    const formData = new FormData();
    formData.append('file', fs.createReadStream(audioPath))
    formData.append('model', 'whisper-1')
    const response = await axios.post(
        OPENAI_WHISPER_URL,
        formData,
        {
            headers: {Authorization: `Bearer ${OPENAI_API_KEY}`, ...formData.getHeaders()}
        }

    )
    return response.data.text;
}