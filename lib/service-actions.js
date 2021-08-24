import axios from "axios";
import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import uniqid from "uniqid"
import { findMovie, remainingMoviesFiltered } from './service-aux.js'

const { readJSON, writeJSON } = fs

const metaPath = fileURLToPath(import.meta.url)
const movieDataJSONPath = join(dirname(metaPath), "../data/movies.json")

// Write
export const writeJSONMovies = JSONMovies => writeJSON(movieDataJSONPath, JSONMovies)
export const getJSONMovies = () => readJSON(movieDataJSONPath)



export const getOMDBData = async (req, res, next) => {
    try {
        const OMDBResponse = await axios.get(process.env.OMDB_API_SEARCH + req.query.search)
        const OMDBResult = OMDBResponse.data.Search
        const moviesList = await getJSONMovies()

        if (OMDBResult !== undefined) moviesList.push(OMDBResult)

        const flatedMoviesList = moviesList.flat()
        writeJSONMovies(flatedMoviesList)

        res.send(OMDBResult).status(200)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

export const checkMovieOnJSON = async (req, res, next) => {
    try {
        if (req.query.search) {
            const moviesList = await getJSONMovies()
            const filteredMovies = moviesList.filter(movies => movies.Title.toLowerCase().includes(req.query.search.toLowerCase()))
            if (filteredMovies.length === 0) {
                console.log('Requesting from external API')
                next()
            } else {
                console.log('From my own Base')
                res.send(filteredMovies)
            }
            return
        }
        if (req.query.id) {
            const moviesList = await getJSONMovies()
            const filteredMovie = await findMovie(req.params.id)
            console.log(req.query.id)
            if (!filteredMovie) {
                next()
            } else {
                res.send(filteredMovie)
                return
            }
            return
        }

        const moviesList = await getJSONMovies()
        res.send(moviesList)
    } catch (error) {
        console.log(error)
        next(error)

    }
}

export const editMovieText = async (req, res, next) => {
    try {
        const errorList = validationResult(req)
        if (!errorList.isEmpty()) {
            next(createHttpError(400, { errorList }))
        }
        else {
            const moviesList = await getJSONMovies()
            const filteredMovie = findMovie(req.params.id)
            if (!filteredMovie) {
                res.status(404).send('Not found')
            } else {
                const remainingMovies = await remainingMoviesFiltered(req.params.id)
                const updatedMovie = {
                    ...filteredMovie,
                    ...req.body,
                    imdbID: req.params.id,
                }
                remainingMovies.push(updatedMovie)
                await writeJSONMovies(remainingMovies)
                res.send(updatedMovie).status(201)
            }
        }

    } catch (error) {
        console.log(error)
        next(error)
    }
}

export const addMovieJSON = async (req, res, next) => {
    try {
        const errorList = validationResult(req)
        if (!errorList.isEmpty()) {
            next(createHttpError(400, { errorList }))
        }
        else {
            const moviesList = await getJSONMovies()
            const newMovie = {
                ...req.body,
                imdbID: uniqid(),
            }
            moviesList.push(newMovie)
            await writeJSONMovies(moviesList)
            res.send(newMovie).status(201)
        }

    } catch (error) {
        console.log(error)
        next(error)
    }
}

export const deleteMovie = async (req, res, next) => {
    try {
        const movieFound = await findMovie(req.params.id)
        if(!movieFound){
            res.status(404).send({msg : `Movie with id ${req.params.id} not found!`})
        } else{
            const remainingMovies = await remainingMoviesFiltered(req.params.id)
            await writeJSONMovies(remainingMovies)
            res.status(204)  
        }

    } catch (error) {
        console.log(error)
        next(error)
    }
}

export const addReview = async (req, res, next) => {
    try {
        const errorList = validationResult(req)
        if (!errorList.isEmpty()) {
            next(createHttpError(400, { errorList }))
        }
        const moviesList = await getJSONMovies()
        const filteredMovie = await findMovie(req.params.id)
        if (!filteredMovie) {
            next(createHttpError(404, { msg: "Movie with ID " + req.params.id + " not found." }))
        }
        else {
            const remainingMovies = await remainingMoviesFiltered(req.params.id)
            let reviewedMovie = ''
            // console.log(filteredMovie)
            if (!filteredMovie.reviews) {
                reviewedMovie = {
                    Title: filteredMovie.Title,
                    Year: filteredMovie.Year,
                    imdbID: filteredMovie.imdbID,
                    Type: filteredMovie.Type,
                    Poster: filteredMovie.Poster,
                    reviews: [{
                        ...req.body,
                        comment_ID: uniqid(),
                        createdAt: new Date
                    }]
                }
            } else {
                reviewedMovie = {
                    Title: filteredMovie.Title,
                    Year: filteredMovie.Year,
                    imdbID: filteredMovie.imdbID,
                    Type: filteredMovie.Type,
                    Poster: filteredMovie.Poster,
                    reviews: [
                        ...filteredMovie.reviews,
                        {
                            ...req.body,
                            comment_ID: uniqid(),
                            createdAt: new Date()
                        }
                    ]
                }
            }
            remainingMovies.push(reviewedMovie)
            await writeJSONMovies(remainingMovies)
            res.send({
                ...req.body,
                comment_ID: uniqid(),
                createdAt: new Date()
            }).status(201)
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
}

export const deleteReview = async (req, res, next) => {
    try {
        const currentMovie = await findMovie(req.params.id)
        if (!currentMovie.reviews || currentMovie.reviews.length === 0) {
            next(createHttpError(404, { msg: `Sorry the movie with ID ${currentMovie.Title}} doesn't have any reviews yet` }))
            return
        }
        if (!currentMovie) {
            next(createHttpError(404, { msg: `Sorry the current movie ${req.params.id}} doesn't have any reviews yet` }))
            return
        }

        const remainingMovies = await remainingMoviesFiltered(req.params.id)
        const reviewIndex = currentMovie.reviews.findIndex(review => review.comment_ID === req.params.reviewID)
       
        if (reviewIndex === -1) {
            next(createHttpError(400, { msg: `Sorry we couldn't found the comment with ID ${req.params.reviewID}} doesn't have any reviews yet` }))
            return
        }
        currentMovie.reviews.splice(reviewIndex, 1)
        remainingMovies.push(currentMovie)

        writeJSONMovies(remainingMovies)
        res.status(204).send()
    } catch (error) {
        console.log(error)
        next(error)
    }
}

export const addPosterToJSON = async (req, res, next) => {
    try {
        const currentMovie = await findMovie(req.params.id)
        if (!currentMovie) {
            next(createHttpError(404, { msg: `Sorry we couldn't find the movie with ID ${req.params.id}` }))
        }
        const remainingMovies = await remainingMoviesFiltered(req.params.id)
        const updatedMovie = {
            ...currentMovie,
            Poster: req.file.path
        }
        remainingMovies.push(updatedMovie)
        writeJSONMovies(remainingMovies)
        res.send(updatedMovie)

    } catch (error) {
        console.log(error)
        next(error)
    }
}

export const getSingleMovie = async (req, res, rext) =>{
    try {
        const filteredMovie = await findMovie(req.params.id)
        if (!filteredMovie) {
            res.status(404).send('Not found')
        } else {
        res.status(200).send({...filteredMovie})
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
}