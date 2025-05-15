
export function beginQuiz() {
    console.log('Begin quiz clicked!');
    SPA.navigatePage('quiz');
}


export function initHomePage() {
    let welcomeHeaderElement = document.getElementById("welcome-heading");
    let user = JSON.parse(localStorage.getItem('user') || 'null');
    if (welcomeHeaderElement) {
        if (user !== 'null') {
        welcomeHeaderElement.innerHTML = `Welcome, ${user.name}!`;
        } else {
            welcomeHeaderElement.innerText = "Welcome!";
        } 
    }
}