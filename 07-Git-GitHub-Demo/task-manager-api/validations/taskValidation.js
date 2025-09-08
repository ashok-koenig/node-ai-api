const {body} = require("express-validator")
const { ERROR_MESSAGE } = require("../constants/errorMessage")

exports.validateTask = [
    body('id').isNumeric().withMessage(ERROR_MESSAGE.INVALID_TASKID),
    body('title').isString().withMessage(ERROR_MESSAGE.INVALID_TITLE)
                .isLength({min: 3}).withMessage(ERROR_MESSAGE.INVALID_TITLE_LENGTH)
]