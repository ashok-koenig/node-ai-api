const {body} = require("express-validator")

exports.promptValidation = [
    body('prompt')
        .isString().withMessage("Prompt must be a string")
        .isLength({min: 3, max: 200}).withMessage('Prompt must be 2-200 characters long')
]