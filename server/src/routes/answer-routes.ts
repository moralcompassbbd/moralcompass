import { Express, Request } from "express";
import answerRepository from "../db/answer-repository";
import { ApiError, mapError } from "../error";
import { authenticationMiddleware } from "../middleware/middleware";
import { GoogleUser } from "common/models";
import userRepository from "../db/user-repository";

export function registerAnswerRoutes(app: Express) {
    app.post('/answers', authenticationMiddleware, async (req: Request<any, any, unknown>, res) => {
        try {
            if (req.body && typeof req.body === 'object' && 'choiceId' in req.body && typeof req.body.choiceId === 'number') {
                const jwt: GoogleUser = res.locals.googleUser;
                const user = await userRepository.getUserByGoogleId(jwt.sub);

                if (!user) {
                    // throw 500 error, since the user should be logged in by now
                    throw new ApiError();
                }

                const answer = await answerRepository.insert(
                    user.userId,
                    req.body.choiceId,
                );
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
