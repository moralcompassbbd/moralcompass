export function beginQuiz() {
    console.log('Begin quiz clicked!');
    SPA.navigatePage('quiz');
}


export function initHomePage() {
    const welcomeHeaderElement = document.getElementById("welcome-heading");
    if (!welcomeHeaderElement) {
        console.error('Welcome header element not found');
        return;
    }

    try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            welcomeHeaderElement.textContent = "Welcome!";
            return;
        }

        const user = JSON.parse(storedUser);
        if (!user?.name) {
            welcomeHeaderElement.textContent = "Welcome!";
            return;
        }

        welcomeHeaderElement.textContent = `Welcome, ${user.name}!`;
    } catch (error) {
        console.error('Error setting welcome message:', error);
        welcomeHeaderElement.textContent = "Welcome!";
    }
}