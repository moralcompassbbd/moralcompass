import { SpaClient } from './spa-client';
import { displayConfirmLogoutModal, handleCredentialResponse } from './main';
import { initHomePage } from './homepage';
import { initQuiz, quizShowNext, quizShowAnswer } from './quiz';
import { initResults } from './results';
import { initManager, showAddQuestionForm, deleteQuestion, submitQuestionForm } from './manager';
import { deleteLocalStorageItem, getLocalStorageItem } from './storage';
import { User } from 'common/models';
import { api } from './api';
import { initUserTable } from './user-tables';

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
    submitQuestionForm: (form: HTMLFormElement) => void,
    initUserTable: () => void,
};

const spaClient: SpaClient<Handlers> = new SpaClient(rootElement, loadingElement, pageTemplateElements, {
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
    submitQuestionForm,
    displayConfirmLogoutModal,
    initUserTable: initUserTable,
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

    api.isAuthenticated().then((isAuthenticated) => {
        if(isAuthenticated){
            const user = getLocalStorageItem<User>("user");
            spaClient.navigatePage('homepage', { name: user ? user.name : ""});
        } else{
            spaClient.navigatePage('main');
            deleteLocalStorageItem("jwt");
            deleteLocalStorageItem("user");
        }
    })
};
