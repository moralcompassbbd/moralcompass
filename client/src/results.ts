import { api } from "./api";

export const initResults = async () => {
    const pageElement = document.getElementById('results-page')!;
    const questionContainer = pageElement.querySelector('article ol')!;

    if (globalThis.questionAnswers.length === 0) {
        const noAnswersElement = document.createElement('h2');
        noAnswersElement.classList.add('no-answers');
        noAnswersElement.innerText = 'You have not answered any questions';
        pageElement.querySelector('article')!.replaceChild(noAnswersElement, questionContainer);

        pageElement.classList.remove('loading-hidden');
        return;
    }

    const questionTemplate = (questionContainer.querySelector('#question-template') as HTMLTemplateElement).content.cloneNode(true) as HTMLLIElement;
    const choiceTemplate = (questionContainer.querySelector('#choice-template') as HTMLTemplateElement).content.cloneNode(true) as HTMLLIElement;

    const allQuestions = await api.getQuestions();

    for (const [questionIndex, questionAnswer] of globalThis.questionAnswers.entries()) {
        const question = allQuestions.find(question => question.questionId == questionAnswer.questionId);
        if (!question) continue;

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
            
            const inputElem = choiceElement.querySelector('input')!;
            inputElem.name = `question-${questionIndex}`;

            if (questionAnswer.answerChoiceId == choice.choiceId) {
                inputElem.checked = true;
            }

            if (popularityText) {
                (choiceElement.querySelector('.agreement') as HTMLDivElement).style.width = popularityText;
            }

            choiceContainer.appendChild(choiceElement);
        }

        questionContainer.appendChild(questionElement);
    }

    pageElement.classList.remove('loading-hidden');
}

export function clearResults() {
    globalThis.questionAnswers = [];
    // reload
    SPA.navigatePage('results');
}
