import { Choice, ChoiceGetRequest, Question } from "common/models";

export const api = {
    getQuestions: async () => {
        const resp = await fetch('/questions');
        if (resp.ok) {
            return await resp.json() as Question[];
        } else {
            throw new Error();
        }
    },
    getChoicesByQuestionId: async (questionId: number) => {
        const resp = await fetch(`/questions/${questionId}`);
        if (resp.ok) {
            return await resp.json() as ChoiceGetRequest;
        } else {
            throw new Error();
        }
    },
};
