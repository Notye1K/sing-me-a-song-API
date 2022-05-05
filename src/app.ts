import cors from "cors";
import express from "express";
import "express-async-errors";
import { errorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware.js";
import recommendationRouter from "./routers/recommendationRouter.js";
import testRouter from "./routers/testRouter.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/recommendations", recommendationRouter);
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'test') {
    app.use(testRouter)
}
app.use(errorHandlerMiddleware);

export default app;
