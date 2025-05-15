import { api } from "./api";
import { Question } from "common/models";

type QuestionAnswer = {
    questionId: number,
    answerChoiceId: number,
};

declare global {
    var questionAnswers: QuestionAnswer[];
}

globalThis.questionAnswers = [];

let question: Question;

export const initQuiz = async () => {
    const quizPageElement = document.getElementById('quiz-page')!;
    const loadingContainer = quizPageElement.querySelector('.loading-container')!;
    const questionElement = quizPageElement.querySelector('.question')!;

    try {
        // Show loading state
        loadingContainer.classList.add('active');
        questionElement.classList.add('loading-hidden');
        
        question = (await api.getQuestionNext())!;
        
        questionElement.innerHTML = questionElement.innerHTML.replace('{{questionText}}', question.text);

        const choicesListElement = questionElement.querySelector('ul')!;
        const choiceTemplateElement = choicesListElement.querySelector('template')!;

        let totalPopularity = 0;
        const choicePopularities: number[] = question.choices.map(choice => {
            totalPopularity += choice.answerCount;
            return choice.answerCount;
        });

        for (const [index, choice] of question.choices.entries()) {
            const choiceElement = document.createElement('li');
            const percentage = choicePopularities[index] / totalPopularity * 100;
            const percentageText = !Number.isNaN(percentage) ? percentage.toFixed(0) + '%' : '';
            
            let choiceHtml = choiceTemplateElement.innerHTML;
            choiceHtml = choiceHtml.replace('{{choiceId}}', choice.choiceId+'');
            choiceHtml = choiceHtml.replace('{{choiceText}}', choice.text+'');
            choiceHtml = choiceHtml.replace('{{choicePopularity}}', percentageText);
            
            choiceElement.innerHTML = choiceHtml;
            choicesListElement.appendChild(choiceElement);
        }

        // Hide loading, show question
        questionElement.classList.remove('loading-hidden');
    } catch (error) {
        console.error('Failed to load question:', error);
    } finally {
        // Always hide loading container
        loadingContainer.classList.remove('active');
    }
};

export function quizShowNext() {
    const quizPageElement = document.querySelector('#quiz-page .question')!;
    quizPageElement.classList.add('show-next');
}

export function quizShowAnswer() {
    const questionElement = document.querySelector('#quiz-page .question')!;
    questionElement.classList.add('show-answer');

    const footerButtonElement = questionElement.querySelector('footer button') as HTMLInputElement;
    footerButtonElement.disabled = true;

    let totalPopularity = 0;

    const choicePopularities: number[] = question.choices.map(choice => {
        totalPopularity += choice.answerCount;
        return choice.answerCount;
    });

    let mostPopular = 0;
    let mostPopularIndex = -1;

    for (const [index, popularity] of choicePopularities.entries()) {
        if (popularity > mostPopular) {
            mostPopular = popularity;
            mostPopularIndex = index;
        }
    }
    
    const choices = [...document.querySelectorAll('#quiz-page .question label')] as HTMLInputElement[];

    let answerIndex: number = -1;
    let answerChoiceId: number = -1;

    for (const [index, choice] of choices.entries()) {
        const radioElement = choice.querySelector('input[type="radio"]')! as HTMLInputElement;

        const choiceId = Number.parseInt(choice.id.replace('choice-', ''));
        
        radioElement.setAttribute('disabled', '');

        if (radioElement.checked) {
            answerIndex = index;
            answerChoiceId = choiceId;
        }

        const popularityPercentage = (choicePopularities[index] / totalPopularity * 100).toFixed(0);

        (choice.querySelector('.agreement') as HTMLDivElement).style.width = `${popularityPercentage}%`;
    }

    globalThis.questionAnswers.push({
        questionId: question.questionId,
        answerChoiceId: answerChoiceId,
    });

    if (mostPopularIndex == answerIndex) {
        document.querySelector('#quiz-page .question footer p')!.innerHTML = 'Most respondents agree';
    } else if (mostPopularIndex >= 0) {
        document.querySelector('#quiz-page .question footer p')!.innerHTML = 'Most respondents disagree';
    }

    const nextButtonElement = document.createElement('button');
    nextButtonElement.innerText = "Next";

    nextButtonElement.addEventListener('click', () => {
        SPA.navigatePage('quiz');
    });

    const footerElement = questionElement.querySelector('footer')! as HTMLDivElement;
    footerElement.replaceChild(nextButtonElement, footerButtonElement);

    // notify api of submission asynchronously, do nothing on failure
    api.postAnswer(answerChoiceId);
}
