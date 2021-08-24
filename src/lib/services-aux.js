import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const {readJSON, writeJSON, writeFile} = fs

const metaPath = fileURLToPath(import.meta.url)

const blogPostImgsFdr = join(dirname(metaPath), "../../public/img/blogPosts/")
const publicAuthorsImgsFdr = join(dirname(metaPath), "../../public/img/authors/")
const commentJSONPath = join(dirname(metaPath), "../data/commentsFile.json")
const authorsJSONPath = join(dirname(metaPath), "../data/authorsFile.json")
const blogPostsJSONPath = join(dirname(metaPath), "../data/blogPostsFile.json")

export const saveAuthors = authorsData => writeJSON(authorsJSONPath, authorsData)
export const getAuthorsList = () => readJSON(authorsJSONPath)

export const saveBlogPosts = blogPost => writeJSON(blogPostsJSONPath, blogPost)
export const getBlogPostsList = () => readJSON(blogPostsJSONPath)

export const saveBlogPostImg = (filename, buffer) => writeFile(join(blogPostImgsFdr, filename), buffer)
export const saveAuthorAvatarImg = (filename, buffer) => writeFile(join(publicAuthorsImgsFdr, filename), buffer)

export const getComments = () => readJSON(commentJSONPath)
export const writeComment = comment => writeJSON(commentJSONPath, comment)
