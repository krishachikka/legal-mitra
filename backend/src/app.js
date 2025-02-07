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

import commonLawsRouter from './routes/commonLaws.routes.js'
import firIpcLawsRouter from './routes/firIpcLaws.routes.js'
import indianConstitution from './routes/indianConstitution.routes.js'
import quesAndAnswers from './routes/quesAndAns.routes.js'
import workerLaws from './routes/workerLaws.routes.js'

app.use('/api/v1/common-laws', commonLawsRouter)
app.use('/api/v1/fir-ipc-laws', firIpcLawsRouter)
app.use('/api/v1/indian-constitution', indianConstitution)
app.use('/api/v1/ques-ans', quesAndAnswers)
app.use('/api/v1/worker-laws', workerLaws)


export { app };