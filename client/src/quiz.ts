import { api } from "./api";

let questions = [];

export const initQuiz = async () => {
    questions = await api.getQuestions();
}
