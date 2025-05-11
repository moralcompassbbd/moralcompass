
type pagePropType = { [key: string]: string };

export class SpaClient<T> {
    currentPage: string;
    pageProps?: pagePropType;
    navigatePage: (page: string, pageProps?: pagePropType) => void;
    handlers: T;

    constructor(root: HTMLElement, pageTemplates: HTMLTemplateElement[], handlers: T, firstPage: string, firstPageProps?: pagePropType) {
        const pageTemplateMap = new Map<string, HTMLTemplateElement>();

        pageTemplates.forEach(element => {
            const pageName = element.getAttribute('data-page');
            if (!pageName) return;
            pageTemplateMap.set(pageName, element);
        });

        this.navigatePage = (page: string, pageProps?: pagePropType) => {
            this.currentPage = page;
            this.pageProps = pageProps;
            const element = pageTemplateMap.get(`${page}`);
            const content = element?.innerHTML ?? '404 Page Not Found';
            root.innerHTML = content;
            
            const onmountScript = element?.getAttribute('data-onmount');
            if (onmountScript) {
                eval(onmountScript);
            }
        };

        this.handlers = handlers;

        this.currentPage = firstPage;
        this.navigatePage(firstPage, firstPageProps);
    }
}
