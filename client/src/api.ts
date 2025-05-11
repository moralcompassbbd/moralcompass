import { Question } from "common/models";

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
};
