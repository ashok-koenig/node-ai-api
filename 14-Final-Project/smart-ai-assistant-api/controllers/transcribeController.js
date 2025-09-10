const { getAudioTranscript } = require("../services/openaiService")
const fs = require('fs')

exports.transcribe = async (req, res,next) => {
    try {
        const transcript = await getAudioTranscript(req.file.path)
        res.json({transcript})
    } catch (error) {
        next(error)
    }finally{
        fs.unlinkSync(req.file.path)
    }
}