import express from 'express';
import 'dotenv/config';
import { renderIndex } from './templates';
import pino from 'pino';
import { ApiErrorResponse } from 'common/models';
import { registerQuestionRoutes } from './routes/question-routes';
import { registerAnswerRoutes } from './routes/answer-routes';

const logger = pino();

const app = express();
const port = process.env.PORT || 3000;

app.get('/', async (_, res) => {
    res.send(renderIndex({}));
});

registerQuestionRoutes(app);
registerAnswerRoutes(app);

app.use('/static', express.static('../client/static'));
app.use('/dist', express.static('../client/dist'));

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
