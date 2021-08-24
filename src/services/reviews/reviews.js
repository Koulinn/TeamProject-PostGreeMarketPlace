import express from "express";
import {
  deleteReview,
  editReview,
  getReviews,
  postReview,
} from "./handlers.js";

const reviewRouter = express.Router();

reviewRouter.route("/").get(getReviews).post;

reviewRouter.route("/:review_id").put(editReview).delete(deleteReview);
//prettier-ignore
reviewRouter.route("/:product_id")
.post(postReview)

export default reviewRouter;
