import express from 'express';
import 'dotenv/config';
import { renderIndex } from './templates';
import pino from 'pino';

const logger = pino();

const app = express();
const port = process.env.PORT || 3000;
const CLIENT_ID = process.env.CLIENT_ID || "534038687097-4ueh2o1b0d87ad38fpkgn3hi8mjeboga.apps.googleusercontent.com";

app.use(express.json());

app.get('/', async (_, res) => {
    res.send(renderIndex({}));
});

interface GoogleUser{
    iss: string,
    azp: string,
    aud: string,
    sub: string,
    email: string,
    email_verified: string,
    nbf: string,
    name: string,
    picture: string,
    given_name: string,
    iat: string,
    exp: string,
    jti: string,
    alg: string,
    kid: string,
    typ: string
}

app.post('/auth/login', async (req, res) => {
    try{
        const token = req.body.token;
        const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
        const data: GoogleUser = await response.json();
    
        if (data.aud !== CLIENT_ID) {
            res.status(401).send({ error: 'Token audience mismatch' });
        } else{
            res.status(200).send({ jwt: token, user: data });
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
