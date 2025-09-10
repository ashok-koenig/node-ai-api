const vision = require('@google-cloud/vision')
const language = require("@google-cloud/language")
require("dotenv").config()

const keyFilename = process.env.GOOGLE_API_KEY_PATH

const visionClient = new vision.ImageAnnotatorClient({keyFilename})
const languageClient = new language.LanguageServiceClient({keyFilename})

exports.analyzeImageAndText = async (imagePath) => {
    const result = await visionClient.labelDetection(imagePath)
    const labels = result[0].labelAnnotations.map(label => label.description).join(", ")

    const syntax = await languageClient.analyzeSyntax({document: { content: labels, type: 'PLAIN_TEXT'}})

    return {labels, syntax: syntax[0].tokens.map(token => token.text.content)}
}