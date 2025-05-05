import { Express, Request } from "express";
import answerRepository from "../db/answer-repository";
import { ApiError, mapError } from "../error";

export function registerAnswerRoutes(app: Express) {
    app.post('/answers', async (req: Request<any, any, unknown>, res) => {
        try {
            if (req.body && typeof req.body === 'object' && 'userId' in req.body && 'choiceId' in req.body && typeof req.body.userId === 'number' && typeof req.body.choiceId === 'number') {
                const answer = await answerRepository.insert({
                    userId: req.body.userId,
                    choiceId: req.body.choiceId,
                });
                res.json(answer);
            } else {
                throw new ApiError({
                    errorCode: 'invalid_body',
                    detail: 'Invalid create answer request.',
                    data: undefined,
                });
            }
        } catch (error) {
            const [apiError, status] = mapError(error);
            res.status(status).json(apiError);
        }
    });
}
