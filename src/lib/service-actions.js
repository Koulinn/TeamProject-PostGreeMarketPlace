import db from "../db/conn.js";

export const getAllProducts = async (req, res, next) => {
  try {
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
            VALUES ('${req.body.name}','${req.body.brand}','${req.body.image_url}','${req.body.description}','${req.body.price}','${req.body.category}','2000-12-25') RETURNING *;
            `);
    res.status(201).send(product.rows[0]);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await db.query(
      `DELETE FROM public.products WHERE product_id=${req.params.product_id};`
    );
    res.status(204).send();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const addImageToTheProduct = async (req, res, next) => {
  try {
    const product =
      await db.query(`UPDATE public.products SET image_url = '${req.file.path}'
      WHERE product_id=${req.params.product_id} RETURNING *;`);
    console.log("product", product.rows[0]);
    res.send(product.rows[0]);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
