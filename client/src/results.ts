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

    const questionTemplateHtml = questionContainer.querySelector('#question-template')!.innerHTML;
    const choiceTemplateHtml = questionContainer.querySelector('#choice-template')!.innerHTML;

    const allQuestions = await api.getQuestions();

    for (const [questionIndex, questionAnswer] of globalThis.questionAnswers.entries()) {
        const question = allQuestions.find(question => question.questionId == questionAnswer.questionId);
        if (!question) continue;

        const questionElem = document.createElement('li');
        questionElem.classList.add('question', 'show-answer');
        questionElem.innerHTML = questionTemplateHtml.replace('{{questionText}}', question.text);

        const choiceContainer = questionElem.querySelector('ul')!;

        let totalAnswers = 0;

        for (const choice of question.choices) {
            totalAnswers += choice.answerCount;
        }

        for (const choice of question.choices) {
            const choiceElem = document.createElement('li');

            const popularity = (choice.answerCount / totalAnswers) * 100;
            const popularityText = Number.isNaN(popularity) ? '' : `${popularity}%`;
            
            let choiceHtml = choiceTemplateHtml.replace('{{choiceText}}', choice.text);
            choiceHtml = choiceHtml.replace(/{{choicePopularity}}/g, popularityText);

            choiceElem.innerHTML = choiceHtml;

            const inputElem = choiceElem.querySelector('input')!;
            inputElem.name = `question-${questionIndex}`;

            if (questionAnswer.answerChoiceId == choice.choiceId) {
                inputElem.checked = true;
            }

            if (popularityText) {
                (choiceElem.querySelector('.agreement') as HTMLDivElement).style.width = popularityText;
            }

            choiceContainer.appendChild(choiceElem);
        }

        questionContainer.appendChild(questionElem);
    }

    pageElement.classList.remove('loading-hidden');
}

export function clearResults() {
    globalThis.questionAnswers = [];
    // reload
    SPA.navigatePage('results');
}
