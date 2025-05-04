import express from 'express';
import 'dotenv/config';
import { renderIndex } from './templates';
import pino from 'pino';

const logger = pino();

const app = express();
const port = process.env.PORT || 3000;

app.get('/', async (_, res) => {
    res.send(renderIndex({}));
});

app.use('/static', express.static('../client/static'));
app.use('/dist', express.static('../client/dist'));

app.listen(port, (err) => {
    if (err) {
        logger.fatal(`Failed to start server: ${err}`);
    } else {
        logger.info(`Server is running on port ${port}`);
    }
});
