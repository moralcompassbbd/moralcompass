
export function beginQuiz() {
    console.log('Begin quiz clicked!');
    SPA.navigatePage('quiz');
}


export function initHomePage() {
    let welcomeHeaderElement = document.getElementById("welcome-heading");
   
    if (welcomeHeaderElement) {
        const user = SPA.pageProps?.name;
        if (user) {
        welcomeHeaderElement.innerHTML = `Welcome, ${user}!`;
        } else {
            welcomeHeaderElement.innerHTML = "Welcome!";
        } 
    }
}