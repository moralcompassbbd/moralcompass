import { Answer, AnswerPostRequest, Question } from "common/models";

export const api = {
    getQuestions: async () => {
        const resp = await fetch('/questions');
        if (resp.ok) {
            return await resp.json() as Question[];
        } else {
            throw new Error();
        }
    },
    getQuestion: async (questionId: number) => {
        const resp = await fetch(`/questions/${questionId}`);
        if (resp.ok) {
            return await resp.json() as Question | null;
        } else {
            throw new Error();
        }
    },
    getQuestionNext: async () => {
        const resp = await fetch('/questions/next');
        if (resp.ok) {
            return await resp.json() as Question | null;
        } else {
            throw new Error();
        }
    },
    postAnswer: async(choiceId: number) => {
        const request: AnswerPostRequest = {
            userId: 1, // todo: use actual user when auth ready
            choiceId,
        };

        const resp = await fetch('/answers', {
            method: 'POST',
            body: JSON.stringify(request),
            headers: { 'Content-Type': 'application/json' },
        });
        if (resp.ok) {
            return await resp.json() as Answer;
        } else {
            throw new Error();
        }
    }
};
