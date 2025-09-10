exports.validateUpload = (allowedTypes) => (req, res, next) => {
    if(!req.file || !allowedTypes.includes(req.file.mimetype)){
        return res.status(400).json({error: 'Invalid or missing file type'})
    }
    next()
}