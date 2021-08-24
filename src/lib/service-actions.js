import axios from "axios";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import uniqid from "uniqid";
import { findMovie, remainingMoviesFiltered } from "./service-aux.js";
import db from "../db/conn.js";

const { readJSON, writeJSON } = fs;

// const metaPath = fileURLToPath(import.meta.url);
// const movieDataJSONPath = join(dirname(metaPath), "../data/movies.json");

// Write
// export const writeJSONMovies = (JSONMovies) =>
//   writeJSON(movieDataJSONPath, JSONMovies);
// export const getJSONMovies = () => readJSON(movieDataJSONPath);

export const getAllProducts = async (req, res, next) => {
  try {
    console.log("inside get all products");
    const products = await db.query(`SELECT * FROM public.products`);
    res.send(products.rows);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const checkMovieOnJSON = async (req, res, next) => {
  try {
    // const moviesList = await getJSONMovies();
    // res.send(moviesList);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const editMovieText = async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const addProduct = async (req, res, next) => {
  try {
    //prettier-ignore
    const product = await db.query(`INSERT INTO public.products(
            name, brand, image_url, description, price,category,updated_at)
            VALUES ('${req.body.name}','${req.body.brand}','${req.body.image_url}','${req.body.description}','${req.body.price}','${req.body.category}','2000-12-25');`);
    console.log("inside add product");
    res.send("text from add product");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteMovie = async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const addReview = async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const addPosterToJSON = async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getSingleMovie = async (req, res, rext) => {
  try {
  } catch (error) {
    console.log(error);
    next(error);
  }
};
