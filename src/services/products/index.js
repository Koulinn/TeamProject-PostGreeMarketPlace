import express from "express";
import {
  getAllProducts,
  checkMovieOnJSON,
  editMovieText,
  addProduct,
  deleteMovie,
  addReview,
  addPosterToJSON,
  deleteReview,
  getSingleMovie,
} from "../../lib/service-actions.js";
import {
  movieFieldsValidation,
  commentValidation,
} from "../../lib/validations.js";
import multer from "multer";
import {
  cloudinaryStorage,
  createPDFPipeline,
} from "../../lib/export-utils.js";

const productsRouter = express.Router();

productsRouter
  .route("/")
  .get(getAllProducts)
  // prettier-ignore
  .post(addProduct);

productsRouter
  .route("/:id")
  .put(editMovieText)
  .delete(deleteMovie)
  .get(getSingleMovie);

// POSTER
productsRouter.post(
  "/:id/poster",
  multer({ storage: cloudinaryStorage }).single("Poster"),
  addPosterToJSON
);

//Reviews
productsRouter.post("/:id/review", commentValidation, addReview);
productsRouter.delete("/:id/review/:reviewID", deleteReview);

// DownloadPDF
productsRouter.get("/:id/pdf", createPDFPipeline);

export default productsRouter;