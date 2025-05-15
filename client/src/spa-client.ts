
type pagePropType = { [key: string]: string };

export class SpaClient<T> {
    currentPage?: string;
    pageProps?: pagePropType;
    navigatePage: (page: string, pageProps?: pagePropType) => void;
    handlers: T;

    constructor(root: HTMLElement, pageTemplates: HTMLTemplateElement[], handlers: T) {
        const pageTemplateMap = new Map<string, HTMLTemplateElement>();

        for (const element of pageTemplates) {
            const pageName = element.getAttribute('data-page');
            
            if (!pageName)
                continue;
            
            pageTemplateMap.set(pageName, element);
        }

        this.navigatePage = (page: string, pageProps?: pagePropType) => {
            this.currentPage = page;
            this.pageProps = pageProps;
            const element = pageTemplateMap.get(`${page}`);
            const content = element?.content?.cloneNode(true);
            
            if (content) {
                root.replaceChildren(content);
            } else {
                root.replaceChildren('404 Page Not Found');
            }
            
            const onmountScript = element?.getAttribute('data-onmount');
            if (onmountScript) {
                eval(onmountScript);
            }
        };

        this.handlers = handlers;
    }
}
