import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'

dotenv.config();

const app = express();

// middlewares

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    })
)

app.use(
    express.json({
        limit: '16kb'
    })
)


app.use(express.urlencoded(
    {
        extended: true,
        limit: "16kb"
    }
));


export { app };