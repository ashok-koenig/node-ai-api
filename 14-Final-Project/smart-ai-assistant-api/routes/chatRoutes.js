const express = require('express');
const { promptValidation } = require('../validations/promptValidation');
const { validationErrorHandler } = require('../middlewares/validationErrorHandler');
const { chat } = require('../controllers/chatController');
const chatRoutes = express.Router();

chatRoutes.post("/", promptValidation, validationErrorHandler, chat)

module.exports = chatRoutes