
import { SpaClient } from './spa-client';
import { beginQuiz, initHomePage } from './homepage';
import { handleCredentialResponse } from './main';
import { initQuiz } from './quiz';
import { initResults } from './results';

const rootElement = document.getElementById('app-root');
if (!rootElement)
    throw new Error('No root element.');

const pageTemplateElements = Array.from(document.querySelectorAll('template.page-template')) as HTMLTemplateElement[];

type Handlers = {
    beginQuiz: () => void,
    initHomePage: () => void,
    initQuiz: () => void,
    initResults: () => void,
    handleCredentialResponse: (response: any) => void
};

const spaClient: SpaClient<Handlers> = new SpaClient(rootElement, pageTemplateElements, {
    beginQuiz: beginQuiz,
    initHomePage: initHomePage,
    initQuiz: initQuiz,
    initResults: initResults,
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
      client_id: '899857308635-vsmeap9pv8b4k01475mu2ref12g46lag.apps.googleusercontent.com',
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