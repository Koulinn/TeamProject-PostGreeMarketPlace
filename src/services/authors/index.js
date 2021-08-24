import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs"
import uniqid from "uniqid"
import multer from "multer";
import authorHandlers from "../../lib/authors-utils.js";
import { validateImgExtension } from "../../lib/validation-utils.js";


const authorsRouter = express.Router()
const dirPath = dirname(fileURLToPath(import.meta.url))
const filePath = join(dirPath, "../../data/authorsFile.json")

const dirPathBlogPosts = dirname(fileURLToPath(import.meta.url))
const blogPostsFilePath = join(dirPathBlogPosts, "../../lib/blogPostsFile.json")

const getBlogPosts = () => {
    const postsAsBuffer = fs.readFileSync(blogPostsFilePath)
    return JSON.parse(postsAsBuffer)
}

// GET all
authorsRouter.get("/", (req, res) => {
    try {
        const authorsList = fs.readFileSync(filePath)
        res.send(authorsList)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})
// get all posts by author 
authorsRouter.get("/:id/blogPosts/", (req, res) => {
    try {
        const authors = JSON.parse(fs.readFileSync(filePath))
        const author = authors.find(author => author.id === req.params.id)
        console.log(author)

        if(!author){
            res.status(404).send({message: `Author with ${req.params.id} is not found`})
        } else{
            const blogPosts = getBlogPosts()
            const authorFilteredBlogPosts = blogPosts.filter(blogPost => blogPost.author.name === author.name)
            res.send(authorFilteredBlogPosts).status(200)
        }

    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})
// GET ID
authorsRouter.get("/:id", (req, res) => {
    try {
        const authors = JSON.parse(fs.readFileSync(filePath))
        const author = authors.find(author => author.id === req.params.id)

        if(!author){
            res.status(404).send({message: `Author with ${req.params.id} is not found`})
        } else{
            
            res.send(author)
        }

    } catch (error) {
        res.status(500).send({ message: error.message })

    }
})
// POST
const checkAuthor = (fileBase, email) => {
    // find if find doesnt return aything if will be undefined that will be read as false, if return something if will be true
    // the ! turns undefined(false) into true
    return !fileBase.find(author => author.email === email)
}

authorsRouter.post("/", (req, res) => {
    try {
        const file = JSON.parse(fs.readFileSync(filePath))
        if (checkAuthor(file, req.body.email)) {
            const { name, surname } = req.body

            // create newAuthor data body info + extra you want
            const newAuthor = {
                ...req.body,
                id: uniqid(),
                avatar: "https://ui-avatars.com/api/?name=" + name + "+" + surname,
                createdAt: new Date()
            }
            file.push(newAuthor)
            fs.writeFileSync(filePath, JSON.stringify(file))

            res.send({ id: JSON.stringify(newAuthor.id) })
        } else {
            res.send('email already being used')
        }

    } catch (error) {
        res.status(500).send({ message: error.message })

    }

})
// UPDATE
authorsRouter.put("/:id", (req, res) => {
    try {
        const file = JSON.parse(fs.readFileSync(filePath))
        // keep all authors except the one from the request
        const authors = file.filter(author => author.id !== req.params.id)
        const author = file.find(author => author.id === req.params.id)

        if(!author){
            res.status(404).send({message: `Author with ${req.params.id} is not found`})
        } else {
            const { name, surname } = req.body
            const updatedAuthor = { ...req.body, 
                avatar: "https://ui-avatars.com/api/?name=" + name + "+" + surname,
                createdAt: author.createdAt, 
                id: req.params.id, 
                updatedAt: new Date() }
            authors.push(updatedAuthor)
            
            fs.writeFileSync(filePath, JSON.stringify(authors))
            
            res.send(updatedAuthor)
        }

    } catch (error) {
        res.status(500).send({ message: error.message })

    }
})
// DELETE

authorsRouter.delete("/:id", (req, res) => {
    try {
        const file = JSON.parse(fs.readFileSync(filePath))
        const author = file.find(author => author.id === req.params.id)
        if(!author){
            res.status(404).send({message: `Author with ${req.params.id} is not found`})
        } else {

        const authors = file.filter(author => author.id !== req.params.id)
        fs.writeFileSync(filePath, JSON.stringify(authors))
        res.send(204)
        }
    } catch (error) {
        res.status(500).send({ message: error.message })

    }
})
// POST Author Img

authorsRouter.post("/:id/uploadAvatar", multer().single('avatarImg'), validateImgExtension, authorHandlers.addAvatar)



export default authorsRouter