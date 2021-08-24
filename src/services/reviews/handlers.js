import db from "../../db/conn.js";

export const getReviews = async (req, res, rext) => {
  try {
    const reviews = await db.query(`SELECT * FROM public.reviews`);
    res.send(reviews.rows);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getSingleReview = async (req, res, rext) => {
  try {
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const postReview = async (req, res, next) => {
  try {
    //prettier-ignore
    console.log(req.params)
    const review = await db.query(`INSERT INTO public.reviews(
            review, rate, product_id)
            VALUES ('${req.body.review}','${req.body.rate}','${req.params.product_id}') RETURNING * ; `);
    res.status(201).send(review.rows[0]);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const editReview = async (req, res, next) => {
  try {
    const review =
      await db.query(`UPDATE public.reviews SET review ='${req.body.review}',
			 rate = '${req.body.rate}'
       WHERE review_id=${req.params.review_id} RETURNING *;`);
    res.send(review.rows[0]);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const review = await db.query(
      `DELETE FROM public.reviews WHERE review_id=${req.params.review_id};`
    );
    res.status(204).send();
  } catch (error) {
    console.log(error);
    next(error);
  }
};
