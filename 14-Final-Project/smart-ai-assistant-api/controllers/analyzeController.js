const fs=require("fs")
const { analyzeImageAndText } = require("../services/googleAIService")

exports.analyzeImage = async(req, res, next) => {
    try {
            const result = await analyzeImageAndText(req.file.path)
            res.json({result})
        } catch (error) {
            next(error)
        }finally{
            fs.unlinkSync(req.file.path)
        }
}