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

export const getSingleProduct = async (req, res, next) => {
  try {
    const product = await db.query(
      `SELECT * FROM public.products WHERE product_id=${req.params.product_id};`
    );
    res.send(product.rows[0]);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const editProduct = async (req, res, next) => {
  try {
    const product =
      await db.query(`UPDATE public.products SET name ='${req.body.name}',
			 brand = '${req.body.brand}',
			 image_url = '${req.body.image_url}',
			 description = '${req.body.description}',
             price = '${req.body.price}',
             category = '${req.body.category}',
             updated_at = '2000-12-25'
             WHERE product_id=${req.params.product_id} RETURNING *;`);
    res.send(product.rows[0]);
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