import express from 'express'
import cors from 'cors'
import authorsRouter from './src/services/authors/index.js'
import blogPostRouter from './src/services/blogPosts/index.js'
import { notFoundErrorHandler, badRequestErrorHandler, serverErrorHandler } from './errorHandlers.js'
import { authorsImgFdrPath, blogPostsImgFdrPath } from './src/lib/server-aux.js'



const server = express()

const port = 3003
// Middlewares that are called for every request

server.use(express.static(authorsImgFdrPath))
server.use(express.static(blogPostsImgFdrPath))
server.use(cors()) // to connect with the front-end
server.use(express.json({limit:"50mb"})) // to allow body being read


// router
server.use('/authors', authorsRouter)
server.use('/blogPost', blogPostRouter)

// Middlewares that are called for errors (status code 400, 500, 300)
server.use(notFoundErrorHandler)
server.use(badRequestErrorHandler)
server.use(serverErrorHandler)


server.listen(port, ()=>{
    console.log('Server running =D port ' + port)
}) // to make the server listen at the specified port

// add error

// console.table(listEndpoints(server)) // to check endpoints
server.on("error", (error)=>
    console.log('Error due' + error))