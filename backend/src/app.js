import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// middlewares
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    })
);

app.use(
    express.json({
        limit: '16kb'
    })
);

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}));

// Import your existing routes
import commonLawsRouter from './routes/commonLaws.routes.js';
import firIpcLawsRouter from './routes/firIpcLaws.routes.js';
import indianConstitution from './routes/indianConstitution.routes.js';
import quesAndAnswers from './routes/quesAndAns.routes.js';
import workerLaws from './routes/workerLaws.routes.js';
import pastJudgement from './routes/caseJudgements.routes.js';

// Import the search route
import searchRouter from './routes/search.routes.js';

// Use your existing routes
app.use('/api/v1/common-laws', commonLawsRouter);
app.use('/api/v1/fir-ipc-laws', firIpcLawsRouter);
app.use('/api/v1/indian-constitution', indianConstitution);
app.use('/api/v1/ques-ans', quesAndAnswers);
app.use('/api/v1/worker-laws', workerLaws);
app.use('/api/v1/past-judgement', pastJudgement);

// Add the search route
app.use('/api/v1/search', searchRouter);

export { app };
