import express from "express";
import cors from "cors";
import { corsConfig, requestSpeedLimiter } from "./src/lib/server-config.js";
import productsRouter from "./src/services/products/index.js";
import reviewRouter from "./src/services/reviews/reviews.js";
import {
  notFoundErrorHandler,
  badRequestErrorHandler,
  serverErrorHandler,
  forbiddenRequest,
} from "./src/lib/error-Handlers.js";
import createTables from "./src/db/scripts/create-tables.js";

const server = express();

// server.use(requestSpeedLimiter);
server.use(express.json());
server.use(cors(corsConfig));
server.use("/products", productsRouter);
server.use("/reviews", reviewRouter);
// Errors middlewares
server.use(notFoundErrorHandler);
server.use(forbiddenRequest);
server.use(badRequestErrorHandler);
server.use(serverErrorHandler);

const port = process.env.PORT;
server.listen(port, async () => {
  try {
    await createTables();
    console.log("Server running port = " + port);
  } catch (error) {
    console.log(error);
  }
});

server.on("error", (err) => console.log(err));
