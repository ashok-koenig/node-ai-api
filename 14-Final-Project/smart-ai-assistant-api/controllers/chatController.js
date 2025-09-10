const { getGPTResponse } = require("../services/openaiService")

exports.chat = async (req, res) => {
    const prompt = req.body.prompt
    const reply = await getGPTResponse(prompt)
    res.json({reply})
}