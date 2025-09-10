const fs = require('fs')
const { analyzeImageAndText } = require('../services/googleAIService')
const { getGPTResponse, getAudioTranscript } = require('../services/openaiService')


exports.smartAssist = async (req, res, next) => {
    const file = req.file
    try {
        let output = ""
        if(file.mimetype.startsWith('image/')){
            const text = await analyzeImageAndText(file.path)
            output = await getGPTResponse(`Summarize this vision analysis: ${JSON.stringify(text)}`)
        }else if(file.mimetype.startsWith('audio/')){
            const transcript = await getAudioTranscript(file.path)
            output = await getGPTResponse(`Summarize this audio transcript: ${transcript}`)
        }
        res.json({summary: output})
    } catch (error) {
        next(error)
    }finally{
        fs.unlinkSync(req.file.path)
    }
}