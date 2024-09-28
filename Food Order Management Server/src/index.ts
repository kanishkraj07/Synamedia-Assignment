import express from 'express';
import appRouter from './routes/route';

const app = express();


app.use(express.json());
app.use("/api/v1", appRouter);

export default app;