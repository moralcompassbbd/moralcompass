import { Express, Request } from "express";
import questionRepository from "../db/question-repository";
import { ApiError, mapError } from "../error";
import choiceRepository from "../db/choice-repository";
import { authenticationMiddleware, authorizationMiddleware } from "../middleware/middleware";

export function registerQuestionRoutes(app: Express) {
        app.get('/questions', authenticationMiddleware, async (_, res) => {
            try {
                const questionModels = await questionRepository.getAll();
                res.json(questionModels);
            } catch (error) {
                const [apiError, status] = mapError(error);
                res.status(status).json(apiError);
            }
        });

        app.get('/questions/next', authenticationMiddleware, async (req, res) => {
            try {
                const question = await questionRepository.getNext(1);
                res.json(question);
            } catch (error) {
                const [apiError, status] = mapError(error);
                res.status(status).json(apiError);
            }
        });
        
        app.get('/questions/:questionId', authenticationMiddleware, async (req, res) => {
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

        app.delete('/questions/:questionId', authenticationMiddleware, async (req, res) => {
            try {
                const questionId = parseInt(req.params.questionId);
                
                if (!Number.isInteger(questionId)) {
                    throw new ApiError({
                        errorCode: 'invalid_route_parameter',
                        detail: 'Question ID is not an integer.',
                        data: undefined,
                    });
                }

                await questionRepository.deleteQuestions(questionId);
                res.status(204).send();
            } catch (error) {
                const [apiError, status] = mapError(error);
                res.status(status).json(apiError);
            }
        });

        app.post('/questions', authenticationMiddleware, async (req: Request<any, any, unknown>, res) => {
            try {
                if (!req.body || typeof req.body !== 'object') {
                    throw new ApiError({
                        errorCode: 'invalid_body',
                        detail: 'Invalid question creation request.',
                        data: undefined,
                    });
                }

                const body = req.body as Record<string, unknown>;
                
                if (typeof body.questionText !== 'string') {
                    throw new ApiError({
                        errorCode: 'invalid_body',
                        detail: 'Question text must be a string',
                        data: undefined
                    });
                }

                if (!Array.isArray(body.choices) || !body.choices.every(choice => typeof choice === 'string')) {
                    throw new ApiError({
                        errorCode: 'invalid_body',
                        detail: 'Choices must be an array of strings',
                        data: undefined
                    });
                }

                const question = await questionRepository.createQuestions({
                    text: body.questionText,
                    choices: body.choices
                });
                
                res.status(201).json(question);
            } catch (error) {
                const [apiError, status] = mapError(error);
                res.status(status).json(apiError);
            }
        });
}
