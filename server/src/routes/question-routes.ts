import { Express } from "express";
import questionRepository from "../db/question-repository";
import { ApiError, mapError } from "../error";
import choiceRepository from "../db/choice-repository";

export function registerQuestionRoutes(app: Express) {
    app.get('/questions', async (_, res) => {
        try {
            const questionModels = await questionRepository.getAll();
            res.json(questionModels);
        } catch (error) {
            const [apiError, status] = mapError(error);
            res.status(status).json(apiError);
        }
    });

    app.get('/questions/next', async (req, res) => {
        try {
            const question = await questionRepository.getNext(1);
            res.json(question);
        } catch (error) {
            const [apiError, status] = mapError(error);
            res.status(status).json(apiError);
        }
    });
    
    app.get('/questions/:questionId', async (req, res) => {
        try {
            const questionId = parseInt(req.params.questionId);
            
            if (!Number.isInteger(questionId)) {
                throw new ApiError({
                    errorCode: 'invalid_route_parameter',
                    detail: 'Question ID is not an integer.',
                    data: undefined,
                });
            }
    
            const questionModels = await questionRepository.get(questionId);
            res.json(questionModels);
        } catch (error) {
            const [apiError, status] = mapError(error);
            res.status(status).json(apiError);
        }
    });
}
