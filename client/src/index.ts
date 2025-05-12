import { SpaClient } from './spa-client';
import { beginQuiz, initHomePage } from './homepage';
import { handleCredentialResponse } from './main';
import { initQuiz, quizShowNext, quizShowAnswer } from './quiz';
import { clearResults, initResults } from './results';
import { initManager, showAddQuestionForm, deleteQuestion, submitQuestionForm } from './manager';

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

const pageTemplateElements = Array.from(document.querySelectorAll('template.page-template')) as HTMLTemplateElement[];

type Handlers = {
    beginQuiz: () => void,
    initHomePage: () => void,
    initQuiz: () => void,
    quizShowNext: () => void,
    quizShowAnswer: () => void,
    initResults: () => void,
    clearResults: () => void,
    handleCredentialResponse: (response: any) => void,
    renderGoogleButton: () => void,
    initManager: () => void,
    showAddQuestionForm: () => void,
    deleteQuestion: (questionId: number) => void,
    submitQuestionForm: (form: HTMLFormElement) => void
};

const spaClient: SpaClient<Handlers> = new SpaClient(rootElement, pageTemplateElements, {
    beginQuiz: beginQuiz,
    initHomePage: initHomePage,
    initQuiz: initQuiz,
    quizShowNext: quizShowNext,
    quizShowAnswer: quizShowAnswer,
    initResults: initResults,
    clearResults: clearResults,
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
        client_id: '899857308635-vsmeap9pv8b4k01475mu2ref12g46lag.apps.googleusercontent.com',
        callback: handleCredentialResponse,
    });

    spaClient.navigatePage('main');
};
