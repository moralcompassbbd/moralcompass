import { api } from "./api";

export const initManager = async () => {
    const managerPage = document.getElementById('manager-page') as HTMLDivElement;
    const questionList = managerPage.querySelector('ol.question-list') as HTMLOListElement;
    const questionTemplate = (managerPage.querySelector('template#question-template') as HTMLTemplateElement).content.cloneNode(true) as HTMLLIElement;
    const choiceTemplate = (managerPage.querySelector('template#choice-template') as HTMLTemplateElement).content.cloneNode(true) as HTMLLIElement;

    const questions = await api.getQuestions();
    
    if (questions.length === 0) {
        const noQuestions = document.createElement('li');
        noQuestions.classList.add('no-answers');
        noQuestions.innerText = 'No questions available';

        questionList.appendChild(noQuestions);
        return;
    }

    for (const question of questions) {
        const questionElement = questionTemplate.cloneNode(true) as HTMLLIElement;
        (questionElement.querySelector('.question-text') as HTMLHeadingElement).innerText = question.text;
        (questionElement.querySelector('.question-delete') as HTMLButtonElement).onclick = () => SPA.handlers.deleteQuestion(question.questionId);

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

        questionList.appendChild(questionElement);
    }
};

export const showAddQuestionForm = () => {
    const dialog = document.getElementById('add-question-dialog') as HTMLDialogElement;
    dialog.showModal();
};

export const deleteQuestion = async (questionId: number) => {
    const dialog = document.getElementById('delete-question-dialog') as HTMLDialogElement;
    
    // Show the dialog and wait for result
    dialog.showModal();
    const result = await new Promise<string>((resolve) => {
        dialog.addEventListener('close', () => {
            resolve(dialog.returnValue);
        }, { once: true });
    });

    if (result === 'confirm') {
        try {
            await api.deleteQuestion(questionId);
            SPA.navigatePage('manager');
        } catch (error) {
            console.error('Failed to delete question:', error);
            alert('Failed to delete question. Please try again.');
        }
    }
};

export const submitQuestionForm = async (form: HTMLFormElement) => {
    try {
        const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
        submitButton.disabled = true;
        form.classList.add('loading');

        const questionText = (form.querySelector('#question-text') as HTMLInputElement).value.trim();
        if (!questionText) {
            alert('Please enter a question');
            return;
        }

        const choices = Array.from(form.querySelectorAll('[name="choice"]'))
            .map(input => (input as HTMLInputElement).value.trim())
            .filter(value => value.length > 0);

        if (choices.length < 2) {
            alert('Please provide at least 2 choices');
            return;
        }

        await api.createQuestion(questionText, choices);
        (form.closest('dialog') as HTMLDialogElement).close();
        form.reset();
        SPA.navigatePage('manager');
    } catch (error) {
        console.error('Failed to add question:', error);
        alert(error instanceof Error ? error.message : 'Failed to add question. Please try again.');
    } finally {
        const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
        submitButton.disabled = false;
        form.classList.remove('loading');
    }
};