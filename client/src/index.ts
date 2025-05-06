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

    // run scripts on page change
    document.querySelectorAll('#app-root script').forEach(async script => {
        if (script instanceof HTMLScriptElement) {
            if (script.src) {
                try {
                    const response = await fetch(script.src);
                    const text = await response.text();
                    eval(text);
                } catch {}
            } else {
                eval(script.innerText);
            }
        }
    });
};

navigatePage('main');
