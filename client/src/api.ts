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
};
