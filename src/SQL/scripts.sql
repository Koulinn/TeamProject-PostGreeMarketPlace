-- DROP TABLE IF EXISTS public.products  CASCADE;
-- DROP TABLE IF EXISTS public.reviews  CASCADE;


CREATE TABLE IF NOT EXISTS public.products
(
    product_id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name character varying(200) NOT NULL,
    brand character varying(50) NOT NULL,
    image_url text NOT NULL,
    description text NOT NULL,
    category character varying(30) NOT NULL,
    price numeric NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at date NOT NULL
);

CREATE TABLE IF NOT EXISTS public.reviews
(
    product_id integer NOT NULL,
    review text NOT NULL,
    rate integer NOT NULL,
    created_at date NOT NULL,
    review_id integer NOT NULL,
    PRIMARY KEY (review_id)
);

