import { ApiError } from "../error";
import pool from "./pool";
import { AnswerPostRequest, Answer } from 'common/models';
import { logger } from "../logger";

export default {
    async insert(answer: AnswerPostRequest): Promise<Answer> {
        let row;
        try {
            const result = await pool.query('INSERT INTO answers (user_id, choice_id) VALUES ($1, $2) RETURNING answer_id, user_id, choice_id, created_at', [answer.userId, answer.choiceId]);
            row = result.rows[0];
        } catch (error) {
            logger.error(error);
            throw new ApiError();
        }
        
        return {
            answerId: row.answer_id,
            userId: row.user_id,
            choiceId: row.choice_id,
            createdAt: row.created_at,
        };
    },
};
