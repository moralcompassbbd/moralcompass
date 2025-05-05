import { AnswerPostRequest } from "common/models";
import { Express, Request } from "express";
import answerRepository from "../db/answer-repository";
import { mapError } from "../error";

export function registerAnswerRoutes(app: Express) {
    app.post('/answers', async (req: Request<{}, {}, AnswerPostRequest>, res) => {
        try {
            const answer = answerRepository.insert(req.body);
            res.json(answer);
        } catch (error) {
            const [apiError, status] = mapError(error);
            res.status(status).json(apiError);
        }
    });
}
