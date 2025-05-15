import { Express } from "express";
import { ApiError, mapError } from "../error";
import { GoogleUser } from "common/models";
import userRepository from "../db/user-repository";
import { authenticationMiddleware, authorizationMiddleware } from "../middleware/middleware";

export function registerAuthRoutes(app: Express){

    app.post('/login', async (req, res) => {
        try{
            const token = req.body.token;
            const response = await fetch(`${process.env.GOOGLE_TOKEN_URL}?id_token=${token}`);
            const googleUser: GoogleUser = await response.json();

            if (googleUser.aud !== process.env.CLIENT_ID) {
                throw new ApiError({
                    errorCode: 'invalid_route_parameter',
                    detail: 'Token audience mismatch',
                    data: undefined,
                });
            } else{
                const user = await userRepository.insertAndRetrieveUser(googleUser.sub, googleUser.name, googleUser.email);
                res.status(200).json({
                    jwt: token,
                    user
                })
            }
        } catch(error){
            if (!(error instanceof ApiError)) {
                console.error(error);
            }

            const [apiError, status] = mapError(error);
            res.status(status).json(apiError);
        }
    });

    app.get('/authenticated', authenticationMiddleware, async (_, res) => {
        res.status(200).send();
    });

    app.get('/authorized', authenticationMiddleware, authorizationMiddleware, async (_, res) => {
        res.status(200).send();
    });
}