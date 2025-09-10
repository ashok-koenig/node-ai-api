exports.errorHandler = (err, req, res, next) => {
    console.error("Error handler: ", err)

    if(err.response?.status == 429){
        return res.status(429).json({error: "Rate limit exceeded. Try again later"})
    }

    if(err.code == 'ECONNABORTED'){
        return res.status(504).json({error: 'OpenAI request timed out'})
    }

    if(err.response?.status == 401){
        return res.status(401).json({error: 'Invalid or missing OpenAI API Key'})
    }

    res.status(500).json({error: "Internal server error"})
}