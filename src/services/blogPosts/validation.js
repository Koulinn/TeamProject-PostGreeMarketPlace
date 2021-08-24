import {body} from 'express-validator'

export const blogPostValidationFields = [
    body("title").exists().withMessage("Title is mandatory").notEmpty().withMessage('Must not be empty'),
    body("content").exists().withMessage("Content is mandatory"),
    body("category").exists().withMessage("Category is mandatory"),
    body("cover").exists().withMessage("Cover is mandatory"),
    body("readTime.value").exists().isNumeric().withMessage("readTime.value is mandatory and should be a number"),
    body("readTime.unit").exists().withMessage("readTime.value is mandatory"),
    body("author.name").exists().withMessage("author.name is mandatory"),
    body("author.avatar").exists().withMessage("author.avatar is mandatory")
]

export const imageBlogPostField = [
    body("blogPostImg").exists().withMessage("blogPostImg is mandatory"),
]