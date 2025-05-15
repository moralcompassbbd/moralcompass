import { Express } from "express";
import { mapError } from "../error";
import userRepository from "../db/user-repository";
import { authenticationMiddleware, authorizationMiddleware } from "../middleware/middleware";
import { setCachedManagerStatus } from "../cache/manager";

export function registerUserRoutes(app: Express){

    app.patch('/manager-status/:userId', authenticationMiddleware, authorizationMiddleware, async (req, res) => {
        try{
            const userId = req.params.userId;
            const makeManager = req.query.makeManager === 'true';
            if(makeManager){
                const result = await userRepository.makeUserManager(userId);
                const sub = await userRepository.getGoogleSub(userId);
                setCachedManagerStatus(sub, true);
                if(result){
                    res.status(201).send();
                } else{
                    res.status(204).send();
                }
            } else{
                const result = await userRepository.demoteUserManagerStatus(userId);
                const sub = await userRepository.getGoogleSub(userId);
                setCachedManagerStatus(sub, false);
                if(result){
                    res.status(200).send();
                } else{
                    res.status(204).send();
                }
            }
        } catch(error){
            const [apiError, status] = mapError(error);
            res.status(status).json(apiError);
        }
    });

    app.get('/users', authenticationMiddleware, authorizationMiddleware, async (req, res) => {
        try{
            const result = await userRepository.getAllUsers();
            res.status(200).json(result);
        } catch(error){
            const [apiError, status] = mapError(error);
            res.status(status).json(apiError);
        }
    })
}