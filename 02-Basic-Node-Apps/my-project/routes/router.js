const express = require("express")
const homePage = require("../controllers/myController")

const router = express.Router()

router.get("/", homePage)

module.exports = router