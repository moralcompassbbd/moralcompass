import express from 'express';
import 'dotenv/config';
import { indexPage } from './templates';
import { ApiErrorResponse } from 'common/models';
import { registerQuestionRoutes } from './routes/question-routes';
import { registerAnswerRoutes } from './routes/answer-routes';
import { registerAuthRoutes } from './routes/auth-route';


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', async (_, res) => {
    res.send(indexPage);
});

app.get('/health', (_, res) => {
    res.status(200).send('OK');
});

registerAuthRoutes(app);
registerQuestionRoutes(app);
registerAnswerRoutes(app);

app.use('/static', express.static('../client/static'));
app.use('/dist', express.static('../client/dist', {
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

app.listen(port, (err) => {
    if (err) {
        console.error(`Failed to start server: ${err}`);
    } else {
        console.info(`Server is running on port ${port}`);
    }
});
