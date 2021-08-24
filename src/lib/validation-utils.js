import createError from "http-errors";

export const validateImgExtension = (req, res, next) =>{
    try {
        const allowedExtensions = ["png", 'jpg', 'jpeg', 'gif']
        const ext = req.file.originalname.split('.')
        if(allowedExtensions.includes(ext[1])){
            next()
        } else {
           next(createError(400, {
                message: `File extension not supported, you sent .${ext[1]}`,
                accepted: allowedExtensions
        }))
        }
        
    } catch (error) {
        next(error)
    }
}