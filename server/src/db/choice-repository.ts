import { ApiError } from "../error";
import pool from "./pool";
import { Choice } from 'common/models';

export default {
    async getByQuestionId(questionId: number): Promise<Choice[]> {
        let result;
        try {
            result = await pool.query('SELECT choice_id, question_id, choice_text FROM choices WHERE question_id = $1', [questionId]);
        } catch (error) {
            console.error(error);
            throw new ApiError();
        }

        const choices = result.rows.map(async row => {
            return {
                choiceId: row.choice_id,
                questionId: row.question_id,
                text: row.choice_text,
                answerCount: await this.getChoiceAnswerCount(row.choice_id),
            };
        });
        
        return await Promise.all(choices);
    },
    async getChoiceAnswerCount(choiceId: number): Promise<number> {
        let result;
        try {
            result = await pool.query('select count(*) as answer_count from choices natural join answers where choice_id = $1', [choiceId]);
        } catch (error) {
            console.error(error);
            throw new ApiError();
        }

        return parseInt(result.rows.at(0)?.answer_count) || 0;
    }
};
