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

app.post('/auth/login', async (req, res) => {
    try{
        const token = req.body.token;
        const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
        const data = await response.json();
    
        if (data.aud !== process.env.CLIENT_ID || "") {
            res.status(401).send({ error: 'Token audience mismatch' });
        } else{
            res.status(200).send({ user: data });
        }
    } catch(error){
        res.status(500).send({ error });
    }
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
