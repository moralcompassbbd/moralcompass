import { ApiError } from "../error";
import choiceRepository from "./choice-repository";
import pool from "./pool";
import { Question } from 'common/models';

export default {
    async getAll(): Promise<Question[]> {
        let result;
        try {
            result = await pool.query('SELECT question_id, question_text FROM questions');
        } catch (error) {
            console.error(error);
            throw new ApiError();
        }
        
        const questionsAsync = result.rows.map(async row => {
            const questionChoices = await choiceRepository.getByQuestionId(row.question_id);
            
            return {
                questionId: row.question_id,
                text: row.question_text,
                choices: questionChoices,
            }
        });

        const questions = await Promise.all(questionsAsync);
        
        return questions;
    },
    async get(question_id: number): Promise<Question | null> {
        let result;
        try {
            result = await pool.query('SELECT question_id, question_text FROM questions WHERE question_id = $1', [question_id]);
        } catch (error) {
            console.error(error);
            throw new ApiError();
        }

        const row = result.rows.at(0);

        if (!row)
            return null;

        const questionChoices = await choiceRepository.getByQuestionId(row.question_id);
        
        return {
            questionId: row.question_id,
            text: row.question_text,
            choices: questionChoices,
        }
    },
};
