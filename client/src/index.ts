const root = document.getElementById('app-root');

if (!root)
    throw new Error('no root element');

const pageTemplateElements = document.querySelectorAll('.page-template');
const pageTemplates = new Map<string, string>();

pageTemplateElements.forEach(page => {
    if (!page.id) return;
    pageTemplates.set(page.id, page.innerHTML);
});

const navigatePage = (page: string, pageProps?: object) => {
    globalThis.pageProps = pageProps;
    const content = pageTemplates.get(`page-${page}`) || '404 Page Not Found';
    root.innerHTML = content;
    bindPageEvents(page); 
};

const bindPageEvents = (page: string) => {
    if (page === 'main') {
        const form = document.getElementById('google-signin-form');
        if (form) {
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                console.log('Form submitted!');
                navigatePage('homepage');
            });
        }
    }

    if (page === 'homepage') {
        const btn = document.getElementById('homepage-begin-quiz-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                console.log('Begin quiz clicked!');
                navigatePage('quiz');
            });
        }
    }

    if (page === 'quiz') {
        const quitBtn = document.getElementById('quiz-quit-btn');
        if (quitBtn) {
            quitBtn.addEventListener('click', () => {
                console.log('Quit quiz clicked!');
                navigatePage('homepage');
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    navigatePage('main');
});