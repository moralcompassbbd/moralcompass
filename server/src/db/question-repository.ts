import { ApiError } from "../error";
import choiceRepository from "./choice-repository";
import pool from "./pool";
import { Question, QuestionCreateRequest } from 'common/models';

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
    async get(questionId: number): Promise<Question | null> {
        let result;
        try {
            result = await pool.query('SELECT question_id, question_text FROM questions WHERE question_id = $1', [questionId]);
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
    async getRandom(): Promise<Question | null> {
        let result;
        try {
            result = await pool.query('select question_id from questions order by random() limit 1')
        } catch (error) {
            console.error(error);
            throw new ApiError();
        }

        const row = result.rows.at(0);
        
        if (!row)
            return null;

        return await this.get(row.question_id);
    },
    async getNext(userId: number): Promise<Question | null> {
        let result;
        try {
            // chose at random one question which the user has not answered in the last 12 hours.
            result = await pool.query("select * from questions where question_id not in (select question_id from questions natural join choices natural join answers where user_id = $1 and created_at > now() - interval '12 hours') order by random() limit 1", [userId])
        } catch (error) {
            console.error(error);
            throw new ApiError();
        }

        const row = result.rows.at(0);

        // if no such questions can be found, choose one at random
        if (row) {
            const questionId = row.question_id;
            return await this.get(questionId);
        } else {
            return await this.getRandom();
        }
    },
    async deleteQuestions(questionId: number): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            await client.query('DELETE FROM answers WHERE choice_id IN (SELECT choice_id FROM choices WHERE question_id = $1)', [questionId]);
            
            await client.query('DELETE FROM choices WHERE question_id = $1', [questionId]);
            
            await client.query('DELETE FROM questions WHERE question_id = $1', [questionId]);
            
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Failed to delete question:', error);
            throw new ApiError({
                errorCode: 'unknown_server_error',
                detail: 'Failed to delete question: ' + (error as Error).message,
                data: undefined
            });
        } finally {
            client.release();
        }
    },

    async createQuestions(question: QuestionCreateRequest): Promise<Question> {
        const client = await pool.connect();
        try {

            if (!question.text || question.text.trim().length === 0) {
                throw new ApiError({
                    errorCode: 'invalid_body',
                    detail: 'Question text cannot be empty',
                    data: undefined
                });
            }
            if (!Array.isArray(question.choices) || question.choices.length < 2) {
                throw new ApiError({
                    errorCode: 'invalid_body',
                    detail: 'At least two choices are required',
                    data: undefined
                });
            }

            await client.query('BEGIN');

            const seqResult = await client.query(`
                SELECT COALESCE(MAX(question_id), 0) + 1 as next_id FROM questions
            `);
            const nextId = seqResult.rows[0].next_id;

            await client.query(`
                SELECT setval(
                    pg_get_serial_sequence('questions', 'question_id'),
                    $1,
                    false
                )
            `, [nextId]);
                
            const questionResult = await client.query(
                'INSERT INTO questions (question_text) VALUES ($1) RETURNING question_id',
                [question.text]
            );

            const questionId = questionResult.rows[0].question_id;

            for (const choiceText of question.choices) {
                await client.query(
                    'INSERT INTO choices (question_id, choice_text) VALUES ($1, $2)',
                    [questionId, choiceText]
                );
            }

            await client.query('COMMIT');

            const newQuestion = await this.get(questionId);
            if (!newQuestion) {
                throw new ApiError({
                    errorCode: 'unknown_server_error',
                    detail: 'Failed to retrieve created question',
                    data: undefined
                });
            }

            return newQuestion;
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Failed to create question:', error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError({
                errorCode: 'unknown_server_error',
                detail: 'Failed to create question: ' + (error as Error).message,
                data: undefined
            });
        } finally {
            client.release();
        }
    }
};
