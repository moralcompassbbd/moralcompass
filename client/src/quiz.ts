import { api } from "./api";

let questions = [];

const initQuiz = async () => {
    questions = await api.getQuestions();
}

globalThis.initQuiz = initQuiz;
