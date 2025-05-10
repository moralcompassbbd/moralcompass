
export function beginQuiz() {
    console.log('Begin quiz clicked!');
    SPA.navigatePage('quiz');
}


export function initHomePage() {
    let welcomeHeaderElement = document.getElementById("welcome-heading");
   
    if (welcomeHeaderElement) {
        if (typeof SPA.pageProps === 'object') {
            const user = SPA.pageProps.name;
            if (user) {
            welcomeHeaderElement.innerHTML = `Welcome, ${user}!`;
            } else {
                welcomeHeaderElement.innerHTML = "Welcome!";
            }
        } else {
             throw new Error('Unexpected page prop type');
        }
    }
}