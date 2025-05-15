import { api } from "./api";

export const initOthers = async () => {
    const pageElement = document.getElementById('others-page')!;
    const questionContainer = pageElement.querySelector('article ol')!;

    const questions = await api.getQuestions();

    if (questions.length === 0) {
        const noAnswersElement = document.createElement('h2');
        noAnswersElement.classList.add('no-answers');
        noAnswersElement.innerText = 'No questions found';
        pageElement.querySelector('article')!.replaceChild(noAnswersElement, questionContainer);
        return;
    }

    const questionTemplate = (questionContainer.querySelector('#question-template') as HTMLTemplateElement).content.cloneNode(true) as HTMLLIElement;
    const choiceTemplate = (questionContainer.querySelector('#choice-template') as HTMLTemplateElement).content.cloneNode(true) as HTMLLIElement;

    for (const [questionIndex, question] of questions.entries()) {
        const questionElement = questionTemplate.cloneNode(true) as HTMLLIElement;
        (questionElement.querySelector('.question-text') as HTMLHeadingElement).innerText = question.text;

        const choiceContainer = questionElement.querySelector('ul')!;

        let totalAnswers = 0;

        for (const choice of question.choices) {
            totalAnswers += choice.answerCount;
        }

        for (const choice of question.choices) {
            const popularity = (choice.answerCount / totalAnswers) * 100;
            const popularityText = Number.isNaN(popularity) ? '' : `${popularity.toFixed(0)}%`;

            const choiceElement = choiceTemplate.cloneNode(true) as HTMLLIElement;
            (choiceElement.querySelector('.choice-text') as HTMLHeadingElement).innerText = choice.text;
            (choiceElement.querySelector('.choice-popularity') as HTMLSpanElement).innerText = popularityText;
            
            if (popularityText) {
                (choiceElement.querySelector('.agreement') as HTMLDivElement).style.width = popularityText;
            }

            choiceContainer.appendChild(choiceElement);
        }

        questionContainer.appendChild(questionElement);
    }
}
