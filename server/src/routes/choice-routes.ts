import { Express } from "express";
import choiceRepository from "../db/choice-repository";
import { ApiError, mapError } from "../error";

export function registerChoiceRoutes(app: Express) {

    app.get('/choices/:questionId', async (req, res) => {
        try {
            const questionId = parseInt(req.params.questionId);
            
            if (!Number.isInteger(questionId)) {
                throw new ApiError({
                    errorCode: 'invalid_route_parameter',
                    detail: 'Question ID is not an integer.',
                    data: undefined,
                });
            }
    
            const choiceModels = await choiceRepository.getByQuestionId(questionId);
            res.json(choiceModels);
        } catch (error) {
            const [apiError, status] = mapError(error);
            res.status(status).json(apiError);
        }
    });
}