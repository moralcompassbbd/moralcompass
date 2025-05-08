import express from 'express';
import 'dotenv/config';
import path from 'path';
import { renderIndex } from './templates';
import { ApiErrorResponse } from 'common/models';
import { registerQuestionRoutes } from './routes/question-routes';
import { registerAnswerRoutes } from './routes/answer-routes';
import { logger } from './logger';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', async (_, res) => {
    res.send(renderIndex({}));
});

app.get('/health', (_, res) => {
    res.status(200).send('OK');
});

registerQuestionRoutes(app);
registerAnswerRoutes(app);

app.use('/static', express.static(path.join(__dirname, '../client/static')));
app.use('/dist', express.static(path.join(__dirname, '../client/dist'), {
    extensions: ['js']
}));

// 404
app.all('*route', (_req, res) => {
    const error: ApiErrorResponse = {
        errorCode: 'not_found',
        detail: 'Resource not found.',
        data: undefined,
    };
    res.status(404).json(error);
})

// 404
app.all('*route', (_req, res) => {
    const error: ApiErrorResponse = {
        errorCode: 'not_found',
        detail: 'Resource not found.',
        data: undefined,
    };
    res.status(404).json(error);
})

app.listen(port, (err) => {
    if (err) {
        logger.fatal(`Failed to start server: ${err}`);
    } else {
        logger.info(`Server is running on port ${port}`);
    }
});
