import { Express } from "express";
import { ApiError, mapError } from "../error";
import { GoogleUser } from "common/models";
import userRepository from "../db/user-repository";

export function registerAuthRoutes(app: Express){
    const CLIENT_ID = process.env.CLIENT_ID;

    app.post('/login', async (req, res) => {
        try{
            const token = req.body.token;
            const response = await fetch(`${process.env.GOOGLE_TOKEN_URL}?id_token=${token}`);
            const googleUser: GoogleUser = await response.json();
    
            if (googleUser.aud !== CLIENT_ID) {
                throw new ApiError({
                    errorCode: 'invalid_route_parameter',
                    detail: 'Token audience mismatch',
                    data: undefined,
                });
            } else{
                const user = await userRepository.retrieveOrInsertUser(googleUser.sub, googleUser.name, googleUser.email);
                res.status(200).json({
                    jwt: token,
                    user
                })
            }
        } catch(error){
            const [apiError, status] = mapError(error);
            res.status(status).json(apiError);
        }
    });
}