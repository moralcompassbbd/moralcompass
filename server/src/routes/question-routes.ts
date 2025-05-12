import { Express, Request } from "express";
import questionRepository from "../db/question-repository";
import { ApiError, mapError } from "../error";

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

    // Delete question endpoint
    app.delete('/questions/:questionId', async (req, res) => {
        try {
            const questionId = parseInt(req.params.questionId);
            
            if (!Number.isInteger(questionId)) {
                throw new ApiError({
                    errorCode: 'invalid_route_parameter',
                    detail: 'Question ID is not an integer.',
                    data: undefined,
                });
            }

            await questionRepository.delete(questionId);
            res.status(204).send();
        } catch (error) {
            const [apiError, status] = mapError(error);
            res.status(status).json(apiError);
        }
    });

    // Add new question endpoint
    app.post('/questions', async (req: Request<any, any, unknown>, res) => {
        try {
            if (!req.body || typeof req.body !== 'object' || !('questionText' in req.body) || !('choices' in req.body)) {
                throw new ApiError({
                    errorCode: 'invalid_body',
                    detail: 'Invalid question creation request.',
                    data: undefined,
                });
            }

            const { questionText, choices } = req.body as { questionText: string, choices: string[] };

            const question = await questionRepository.create({
                text: questionText,
                choices: choices
            });
            
            res.status(201).json(question);
        } catch (error) {
            const [apiError, status] = mapError(error);
            res.status(status).json(apiError);
        }
    });
}
