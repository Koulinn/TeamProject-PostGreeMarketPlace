import express from "express";
import {
  getAllProducts,
  getSingleProduct,
  editProduct,
  addProduct,
  deleteProduct,
  addReview,
  addImageToTheCloud,
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
  .route("/:product_id")
  .put(editProduct)
  .delete(deleteProduct)
  .get(getSingleProduct);

// POSTER
productsRouter.post(
  "/:id/image",
  multer({ storage: cloudinaryStorage }).single("image_url"),
  addImageToTheCloud
);

//Reviews
productsRouter.post("/:id/review", commentValidation, addReview);
productsRouter.delete("/:id/review/:reviewID", deleteReview);

// DownloadPDF
productsRouter.get("/:id/pdf", createPDFPipeline);

export default productsRouter;
