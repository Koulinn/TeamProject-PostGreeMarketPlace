import express from "express";
import { getReviews, postReview } from "./handlers.js";

const reviewRouter = express.Router();

reviewRouter.route("/").get(getReviews).post;

//prettier-ignore
reviewRouter.route("/:product_id")
.post(postReview)
.put()
.delete()
.get();

export default reviewRouter;
