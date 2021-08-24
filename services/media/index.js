import express from "express";
import {
    getOMDBData, checkMovieOnJSON, editMovieText,
    addMovieJSON, deleteMovie, addReview, addPosterToJSON,
    deleteReview, getSingleMovie
    } from '../../lib/service-actions.js'
import { movieFieldsValidation, commentValidation } from '../../lib/validations.js'
import multer from "multer";
import { cloudinaryStorage, createPDFPipeline } from "../../lib/export-utils.js";



const mediaRouter = express.Router()

mediaRouter.route('/')
    .get(checkMovieOnJSON, getOMDBData)
    .post(movieFieldsValidation, addMovieJSON)

mediaRouter.route('/:id')
    .put(editMovieText)
    .delete(deleteMovie)
    .get(getSingleMovie)

// POSTER
mediaRouter.post('/:id/poster', multer({ storage: cloudinaryStorage }).single('Poster'), addPosterToJSON)

//Reviews
mediaRouter.post('/:id/review', commentValidation, addReview)
mediaRouter.delete('/:id/review/:reviewID', deleteReview)

// DownloadPDF
mediaRouter.get('/:id/pdf', createPDFPipeline)



export default mediaRouter