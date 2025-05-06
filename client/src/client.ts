const root = document.getElementById('app-root');

if (!root)
    throw new Error('no root element');

const pageTemplateElements = document.querySelectorAll('template.page-template');
const pageTemplates = new Map<string, HTMLTemplateElement>();

pageTemplateElements.forEach(element => {
    const pageName = element.getAttribute('data-page');
    if (!pageName) return;
    pageTemplates.set(pageName, element as HTMLTemplateElement);
});

globalThis.navigatePage = (page: string, pageProps?: object) => {
    globalThis.pageProps = pageProps;
    const element = pageTemplates.get(`${page}`);
    const content = element?.innerHTML ?? '404 Page Not Found';
    root.innerHTML = content;
    
    const onmountScript = element?.getAttribute('data-onmount');
    if (onmountScript) {
        eval(onmountScript);
    }
};

window.onerror = (message, source, lineno, colno, error) => {
    console.error(`${source}:${lineno}:${colno} - uncaught error: ${message}`, error);
    globalThis.navigatePage('error');
    return true;
};

document.addEventListener('DOMContentLoaded', () => globalThis.navigatePage('main'));
