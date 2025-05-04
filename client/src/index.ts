
const rootElement = document.getElementById('app-root');

if (!rootElement)
    throw new Error('no root element');

const pageTemplateElements = document.querySelectorAll('.page-template');
const pageTemplates = new Map<string, string>();

pageTemplateElements.forEach(page => {
    if (!page.id) return;
    pageTemplates.set(page.id, page.innerHTML);
});

const navigatePage = (page: string) => {
    rootElement.innerHTML = pageTemplates.get(`page-${page}`) || '404 Page Not Found';
};

navigatePage('main');
