import { SpaClient } from './spa-client';
import { beginQuiz, initHomePage } from './homepage';
import { handleCredentialResponse } from './main';
import { initQuiz, quizShowNext, quizShowAnswer } from './quiz';
import { initResults } from './results';
import { initManager, showAddQuestionForm, deleteQuestion, submitQuestionForm } from './manager';
import { initOthers } from './others';

const renderGoogleButton = () => {
    window.google.accounts.id.renderButton(
        document.getElementById('g_id_signin')!,
        {
            type: 'standard',
            shape: 'pill',
            theme: 'filled_black',
            text: 'signin_with',
            size: 'large',
            logo_alignment: 'left',
        }
    );
}

const rootElement = document.getElementById('app-root');
if (!rootElement)
    throw new Error('No root element.');

const loadingElement = document.getElementById('app-loading');
if (!loadingElement)
    throw new Error('No loading element.');

const pageTemplateElements = Array.from(document.querySelectorAll('template.page-template')) as HTMLTemplateElement[];

type Handlers = {
    beginQuiz: () => void,
    initHomePage: () => void,
    initQuiz: () => void,
    quizShowNext: () => void,
    quizShowAnswer: () => void,
    initResults: () => void,
    initOthers: () => void,
    handleCredentialResponse: (response: any) => void,
    renderGoogleButton: () => void,
    initManager: () => void,
    showAddQuestionForm: () => void,
    deleteQuestion: (questionId: number) => void,
    submitQuestionForm: (form: HTMLFormElement) => void
};

const spaClient: SpaClient<Handlers> = new SpaClient(rootElement, loadingElement, pageTemplateElements, {
    beginQuiz: beginQuiz,
    initHomePage: initHomePage,
    initQuiz: initQuiz,
    quizShowNext: quizShowNext,
    quizShowAnswer: quizShowAnswer,
    initResults: initResults,
    initOthers: initOthers,
    handleCredentialResponse: handleCredentialResponse,
    renderGoogleButton: renderGoogleButton,
    initManager,
    showAddQuestionForm,
    deleteQuestion,
    submitQuestionForm
});

declare global {
    var SPA: SpaClient<Handlers>;
    interface Window {
        google: any;
    }
}

globalThis.SPA = spaClient;

window.onerror = (message, source, lineno, colno, error) => {
    console.error(`${source}.js:${lineno}:${colno} - uncaught error: ${message}`, error);
    spaClient.navigatePage('error');
    return true;
};

window.onload = () => {
    window.google.accounts.id.initialize({
        client_id: '534038687097-4ueh2o1b0d87ad38fpkgn3hi8mjeboga.apps.googleusercontent.com',
        callback: handleCredentialResponse,
    });

    spaClient.navigatePage('main');
};
