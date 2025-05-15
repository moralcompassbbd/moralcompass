import { api } from "./api";

export const initManager = async () => {
    
    const managerPage = document.getElementById('manager-page')!;
    const questionList = managerPage.querySelector('.question-list ul')!;
    const questionTemplate = managerPage.querySelector('#question-template') as HTMLTemplateElement;

    if (!questionTemplate) {
        console.error('Question template not found');
        return;
    }

    try {
        const questions = await api.getQuestions();
        
        questionList.innerHTML = '';

        if (questions.length === 0) {
            questionList.innerHTML = '<li class="no-questions">No questions available</li>';
            return;
        }

        for (const question of questions) {
            const questionElement = document.createElement('li');
            let html = questionTemplate.innerHTML.replace('{{questionText}}', question.text);
            html = html.replace('{{questionId}}', question.questionId.toString());
            
            const choicesHtml = question.choices
                .map(choice => `<li>${choice.text}</li>`)
                .join('');
            
            html = html.replace('{{choices}}', choicesHtml);
            
            questionElement.innerHTML = html;
            questionList.appendChild(questionElement);
        }
    } catch (error) {
        console.error('Failed to load questions:', error);
        questionList.innerHTML = '<li class="error">Failed to load questions</li>';
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
            await initManager();
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
        await initManager();
        form.reset();
    } catch (error) {
        console.error('Failed to add question:', error);
        alert(error instanceof Error ? error.message : 'Failed to add question. Please try again.');
    } finally {
        const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
        submitButton.disabled = false;
        form.classList.remove('loading');
    }
};