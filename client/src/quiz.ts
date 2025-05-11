import { api } from "./api";
import { Question, Choice, Answer } from "common/models";
import { createButton, createQuestionContainer } from "./components";

type QuestionAnswer = {
    question: Question,
    answerChoiceId: number,
};

const answers: QuestionAnswer[] = [];

export const initQuiz = async () => {
    const question = (await api.getQuestionNext())!;

    const quizPageElement = document.getElementById('quiz-page')!;

    let quizInnerHtml = quizPageElement.innerHTML;
    quizInnerHtml = quizInnerHtml.replace('{{questionText}}', question.text);

    quizPageElement.innerHTML = quizInnerHtml;
}
