const {validationResult} = require("express-validator")
const { STATUS_CODE } = require("../constants/statusCode")

exports.validationErrorHandler = (req, res, next) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(STATUS_CODE.BAD_REQUEST).json({errors: errors.array().map(e => (
            {
                field: e.path,
                message: e.msg
            }
        ))})
    }
    next()
}