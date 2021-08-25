import express from "express";
import {
  getAllProducts,
  getSingleProduct,
  editProduct,
  addProduct,
  deleteProduct,
  addImageToTheProduct,
} from "../../lib/service-actions.js";

import {
  movieFieldsValidation,
  commentValidation,
} from "../../lib/validations.js";
import multer from "multer";
import { cloudinaryStorage } from "../../lib/export-utils.js";

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
  "/:product_id/image",
  multer({ storage: cloudinaryStorage }).single("image_url"),
  addImageToTheProduct
);

export default productsRouter;
