
export function beginQuiz() {
    console.log('Begin quiz clicked!');
    SPA.navigatePage('quiz');
}


export function initHomePage() {
    let welcomeHeaderElement = document.getElementById("welcome-heading");
   
    if (welcomeHeaderElement) {
        welcomeHeaderElement.style.color = "#4A3B74";
        const user = SPA.pageProps?.name;
        if (user) {
        welcomeHeaderElement.innerHTML = `Welcome, ${user}!`;
        } else {
            welcomeHeaderElement.innerHTML = "Welcome!";
        } 
    }
}