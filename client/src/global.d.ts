export {};

declare global {
    var pageProps: object | undefined;
    var navigatePage: (page: string, pageProps?: object) => void;
};
