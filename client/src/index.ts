const root = document.getElementById('app-root');

if (!root)
    throw new Error('no root element');

const pageTemplateElements = document.querySelectorAll('.page-template');
const pageTemplates = new Map<string, string>();

pageTemplateElements.forEach(page => {
    if (!page.id) return;
    pageTemplates.set(page.id, page.innerHTML);
});

globalThis.navigatePage = (page: string, pageProps?: object) => {
    globalThis.pageProps = pageProps;
    const content = pageTemplates.get(`page-${page}`) || '404 Page Not Found';
    root.innerHTML = content;
};

document.addEventListener('DOMContentLoaded', () => globalThis.navigatePage('main'));
