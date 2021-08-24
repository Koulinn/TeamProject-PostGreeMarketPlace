
import { saveAuthors, getAuthorsList, saveAuthorAvatarImg } from "../lib/services-aux.js";

export const createAvatar = async (req, res, next) => {
    console.log('inside createAVatar')
    try {
        const authors = await getAuthorsList()
        const author = authors.find(author => author.id === req.params.id)
        const filteredAuthors = authors.filter(author => author.id !== req.params.id)
        if(!author){
            res.status(404).send({message: `Author with ${req.params.id} is not found`})
        } else {
            const imgExtension = req.file.originalname.split('.')[1]
            const imgFileName = `${req.params.id}.${imgExtension}`
            await saveAuthorAvatarImg(imgFileName, req.file.buffer)
            const avatarAddedAuthor = {
                ...author,
                avatar: `http://localhost:3003/${imgFileName}`
            }

            filteredAuthors.push(avatarAddedAuthor)
            await saveAuthors(filteredAuthors)
        
            res.status(201).send({added: true, body: avatarAddedAuthor})
        }
    } catch (error) {
        res.status(500).send({ message: error.message })

    }
}


const authorHandlers = {
    addAvatar : createAvatar
}

export default authorHandlers

