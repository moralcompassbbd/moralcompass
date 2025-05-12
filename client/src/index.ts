
import { SpaClient } from './spa-client';
import { beginQuiz, initHomePage } from './homepage';
import { handleCredentialResponse } from './main';
import { initQuiz, quizShowNext, quizShowAnswer } from './quiz';
import { clearResults, initResults } from './results';

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
    handleCredentialResponse: (response: any) => void
};

const spaClient: SpaClient<Handlers> = new SpaClient(rootElement, pageTemplateElements, {
    beginQuiz: beginQuiz,
    initHomePage: initHomePage,
    initQuiz: initQuiz,
    quizShowNext: quizShowNext,
    quizShowAnswer: quizShowAnswer,
    initResults: initResults,
    clearResults: clearResults,
    handleCredentialResponse: handleCredentialResponse
}, 'main');

declare global {
    var SPA: SpaClient<Handlers>;
    interface Window {
        google: any;
    }
}

globalThis.SPA = spaClient;

window.onload = function () {
    window.google.accounts.id.initialize({
      client_id: '534038687097-4ueh2o1b0d87ad38fpkgn3hi8mjeboga.apps.googleusercontent.com',
      callback: SPA.handlers.handleCredentialResponse
    });

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
};

window.onerror = (message, source, lineno, colno, error) => {
    console.error(`${source}.js:${lineno}:${colno} - uncaught error: ${message}`, error);
    spaClient.navigatePage('error');
    return true;
};

document.addEventListener('DOMContentLoaded', () => {
    spaClient.navigatePage('main');
});