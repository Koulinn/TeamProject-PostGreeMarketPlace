import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs"
import uniqid from "uniqid"
import { blogPostValidationFields, imageBlogPostField } from './validation.js'
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import multer from "multer";
import {saveBlogPostImg, writeComment, getComments, saveBlogPosts, getBlogPostsList} from '../../lib/services-aux.js'


const blogPostRouter = express.Router()
const dirPath = dirname(fileURLToPath(import.meta.url))
const blogPostsFilePath = join(dirPath, "../../data/blogPostsFile.json")

const getBlogPosts = () => {
    const postsAsBuffer = fs.readFileSync(blogPostsFilePath)
    return JSON.parse(postsAsBuffer)
}

const writeBlogPost = (content) => fs.writeFileSync(blogPostsFilePath, JSON.stringify(content))


// GET all posts
blogPostRouter.get("/", (req, res, next) => {
    try {
        const blogPosts = getBlogPosts()
        console.log(req.query)
        if(req.query && req.query.title){
            const filteredBlogPosts = blogPosts.filter(blogPost => blogPost.title.toLowerCase().includes(req.query.title.toLowerCase()))
            res.send(filteredBlogPosts)
        } else {
            res.send(blogPosts)
        }

    } catch (error) {
        // res.sendStatus(500).send({ message: error.message })
        next(error)

    }
})
// GET ID
blogPostRouter.get("/:id", (req, res, next) => {
    try {
        const blogPosts = getBlogPosts()
        const selectedBlogPost = blogPosts.find(blogPost => blogPost._id === req.params.id)

        if (!selectedBlogPost) {
            next(createHttpError(404), { message: `Blog Post requested with ${req.params.id} is not found` })
            // res.status(404).send({ message: `Blog Post requested with ${req.params.id} is not found` })
        } else {

            res.send(selectedBlogPost)
        }

    } catch (error) {
        // res.send(500).send({ message: error.message })
        next(error)
    }
})
// POST

blogPostRouter.post("/", blogPostValidationFields, (req, res, next) => {
    try {
        const errorList = validationResult(req)

        if (!errorList.isEmpty()) {
            // res.status(400).send(errorList)
            console.log(errorList)
            next(createHttpError(400,  {errorList} ))
        } else {
            const blogPosts = getBlogPosts()
            const newBlogPost = {
                _id: uniqid(),
                ...req.body,
                createdAt: new Date()
            }
            blogPosts.push(newBlogPost)
            writeBlogPost(blogPosts)

            res.status(201).send({ id: newBlogPost._id })
        }


    } catch (error) {
        // res.status(500).send({ message: error.message })
        next(error)

    }

})
// UPDATE
blogPostRouter.put("/:id", blogPostValidationFields, (req, res, next) => {
    const errorList = validationResult(req)
    try {

        if (!errorList.isEmpty()) {
            next(createHttpError(400, { errorList }))
        } else {

            const blogPosts = getBlogPosts()
            const remainingBlogPosts = blogPosts.filter(blogPost => blogPost._id !== req.params.id)
            const blogPostToUpdate = blogPosts.find(blogPost => blogPost._id === req.params.id)


            if (!blogPostToUpdate) {
                res.status(404).send({ message: `Blog to with ${req.params.id} id is not found` })
            } else {
                const updatedBlogPost = {
                    _id: req.params.id,
                    ...req.body,
                    author: {
                        name: blogPostToUpdate.author.name,
                        avatar: blogPostToUpdate.author.avatar
                    },
                    createdAt: blogPostToUpdate.createdAt,
                    updatedAt: new Date()
                }
                remainingBlogPosts.push(updatedBlogPost)
                writeBlogPost(remainingBlogPosts)
                res.send(updatedBlogPost)
            }
        }

    } catch (error) {
        // res.send(500).send({ message: error.message })
        next(error)

    }
})
// DELETE

blogPostRouter.delete("/:id", (req, res, next) => {
    
    try {
        const blogPosts = getBlogPosts()
        const blogPost = blogPosts.find(blogPost => blogPost._id === req.params.id)
        if (!blogPost) {
            next(createHttpError(404), { message: `Blog Post requested with ${req.params.id} is not found` })
            // res.status(404).send({ message: `Blog post with ${req.params.id} is not found` })
        } else {
            const remainingBlogPosts = blogPosts.filter(blogPost => blogPost._id !== req.params.id)
            fs.writeFileSync(blogPostsFilePath, JSON.stringify(remainingBlogPosts))
            res.send(204)
        }
    } catch (error) {
        // res.send(500).send({ message: error.message })
        next(error)

    }
})

// POST IMG
blogPostRouter.post("/:id/uploadCover", multer().single("blogPostImg"), async(req, res, next) => {
    // console.log(req.body)
    try {
        // const errorList = validationResult(req)
        // if(!errorList.isEmpty()){
        //     next(createHttpError(400, {errorList}))
        // }


        const blogPosts = await getBlogPostsList()
        const currentBlogPost = blogPosts.find( blogPost => blogPost._id === req.params.id)
        const filteredBlogPosts = blogPosts.filter(blogPost => blogPost._id !== req.params.id)
        if(!currentBlogPost){
            res.status(404).send({message: "Blog not found"})
        } else {
            const imgExtension = req.file.originalname.split('.')[1]
            const imgFileName = `${req.params.id}.${imgExtension}`
            await saveBlogPostImg(imgFileName, req.file.buffer)

            const blogPostAddedImg = {
                ...currentBlogPost,
                cover: `http://localhost:3001/${imgFileName}`
            }

            filteredBlogPosts.push(blogPostAddedImg)
            await saveBlogPosts(filteredBlogPosts)

            res.status(200).send({uploaded:true, body:blogPostAddedImg})
        }
    } catch (error) {
        next(error)
    }
})


// POST COMMENTS
blogPostRouter.post("/:id/comments", async(req, res, next) => {
    
    try {
        const comments = await getComments()
        const newComment ={
            ...req.body,
            createdAt: new Date(),
            _commentID: uniqid(),
            _blogPostId: req.params.id
        }
        comments.push(newComment)
        
        await writeComment(comments)
        res.status(200).send({created: true, comment: newComment})
   
    } catch (error) {
        // res.send(500).send({ message: error.message })
        next(error)
    }
})

// GET ALL Comments for specific BlogPost
blogPostRouter.get("/:id/comments", async(req, res, next) => {
    try {
        const comments = await getComments()   
        const filteredComments = comments.filter(comment => comment._blogPostId === req.params.id)
        res.status(200).send(filteredComments)
   
    } catch (error) {
        next(error)
    }
})

// PUT Comments
blogPostRouter.put("/comment/:_commentID", async(req, res, next) => {
    console.log(req.body)
    try {
        const comments = await getComments()   
        const filteredComments = comments.filter(comment => comment._commentID !== req.params._commentID)
        const updatedComment = {
            ...req.body,
            _commentID: req.params._commentID,
            updatedAt: new Date()
        }
        filteredComments.push(updatedComment)
        await writeComment(filteredComments)
        res.status(200).send({updated:true, updatedComment})
   
    } catch (error) {
        next(error)
    }
})
// DELETE Comments
blogPostRouter.delete("/comment/:_commentID", async(req, res, next) => {
    try {
        const comments = await getComments()   
        const filteredComments = comments.filter(comment => comment._commentID !== req.params._commentID)
        await writeComment(filteredComments)
        res.status(204).send({deleted:true})
   
    } catch (error) {
        next(error)
    }
})

export default blogPostRouter