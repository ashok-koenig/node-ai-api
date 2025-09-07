const { ERROR_MESSAGE } = require("../constants/errorMessage")
const { STATUS_CODE } = require("../constants/statusCode")

const errorHandler = (err, req, res, next) => {
    res.status(err.statusCode || STATUS_CODE.SERVER_ERROR)
        .json({error: err.message || ERROR_MESSAGE.SERVER_ERROR})
}

module.exports = errorHandler