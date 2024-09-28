import express from "express";
import orderRouter from "./order/order";

const appRouter = express.Router();

appRouter.use('/order', orderRouter);

export default appRouter;