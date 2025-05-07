import { Express } from "express";
import { ApiError, mapError } from "../error";
import { GoogleUser } from "common/models";
import userRepository from "../db/user-repository";

export function registerAuthRoutes(app: Express){
    const CLIENT_ID = process.env.CLIENT_ID || "534038687097-4ueh2o1b0d87ad38fpkgn3hi8mjeboga.apps.googleusercontent.com";

    app.post('/login', async (req, res) => {
        try{
            const token = req.body.token;
            const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
            const googleUser: GoogleUser = await response.json();
    
            if (googleUser.aud !== CLIENT_ID) {
                throw new ApiError({
                    errorCode: 'invalid_route_parameter',
                    detail: 'Token audience mismatch',
                    data: undefined,
                });
            } else{
                const user = await userRepository.getOrInsert(googleUser.sub, googleUser.name, googleUser.email);
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