import { ApiError } from "../error";
import { logger } from "../logger";
import pool from "./pool";
import { Choice } from 'common/models';

export default {
    async getByQuestionId(questionId: number): Promise<Choice[]> {
        let result;
        try {
            result = await pool.query('SELECT choice_id, question_id, choice_text FROM choices WHERE question_id = $1', [questionId]);
        } catch (error) {
            logger.error(error);
            throw new ApiError();
        }

        const choices = result.rows.map(row => {
            return {
                choiceId: row.choice_id,
                questionId: row.question_id,
                text: row.choice_text,
            };
        });
        
        return choices;
    },
};
