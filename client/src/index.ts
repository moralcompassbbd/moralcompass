import { SpaClient } from './spa-client';
import { beginQuiz } from './homepage';
import { clickGoogleButton } from './main';
import { initQuiz } from './quiz';
import { initResults } from './results';

const rootElement = document.getElementById('app-root');
if (!rootElement)
    throw new Error('No root element.');

const pageTemplateElements = Array.from(document.querySelectorAll('template.page-template')) as HTMLTemplateElement[];

type Handlers = {
    beginQuiz: () => void,
    clickGoogleButton: () => void,
    initQuiz: () => void,
    initResults: () => void
};

const spaClient: SpaClient<Handlers> = new SpaClient(rootElement, pageTemplateElements, {
    beginQuiz: beginQuiz,
    clickGoogleButton: clickGoogleButton,
    initQuiz: initQuiz,
    initResults: initResults
}, 'main');

declare global {
    var SPA: SpaClient<Handlers>;
}

globalThis.SPA = spaClient;

window.onerror = (message, source, lineno, colno, error) => {
    console.error(`${source}.js:${lineno}:${colno} - uncaught error: ${message}`, error);
    spaClient.navigatePage('error');
    return true;
};

document.addEventListener('DOMContentLoaded', () => spaClient.navigatePage('main'));
