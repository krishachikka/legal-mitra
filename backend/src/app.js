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
import commonLawsRouter from './routes/api_calls/commonLaws.routes.js';
import firIpcLawsRouter from './routes/api_calls/firIpcLaws.routes.js';
import indianConstitution from './routes/api_calls/indianConstitution.routes.js';
import quesAndAnswers from './routes/api_calls/quesAndAns.routes.js';
import workerLaws from './routes/api_calls/workerLaws.routes.js';
import pastJudgement from './routes/api_calls/caseJudgements.routes.js';
import lawyersRoute from './routes/lawyer.routes.js';


// Import the search route
import searchRouter from './routes/search.routes.js';

// Use your existing routes
app.use('/api/v1/common-laws', commonLawsRouter);
app.use('/api/v1/fir-ipc-laws', firIpcLawsRouter);
app.use('/api/v1/indian-constitution', indianConstitution);
app.use('/api/v1/ques-ans', quesAndAnswers);
app.use('/api/v1/worker-laws', workerLaws);
app.use('/api/v1/past-judgement', pastJudgement);
app.use('/api/v1/lawyers-directory', lawyersRoute);



// Add the search route
app.use('/api/v1/search', searchRouter);

export { app };
