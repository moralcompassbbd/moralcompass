import { api } from "./api";

export function beginQuiz() {
    console.log('Begin quiz clicked!');
    SPA.navigatePage('quiz');
}


export function initHomePage() {
    let welcomeHeaderElement = document.getElementById("welcome-heading");
   
    if (welcomeHeaderElement) {
        const user = SPA.pageProps?.name;
        if (user) {
            welcomeHeaderElement.innerText = `Welcome, ${user}!`;
        } else {
            welcomeHeaderElement.innerText = "Welcome!";
        } 
    }

    addManagerCards();
}

async function addManagerCards(){
    const isAuthorized = await api.isAuthorized();
    if(isAuthorized){
        const homepageCardList = document.querySelector(".homepage-cards ul");

        if(homepageCardList){
            const img = document.createElement('img');
            img.src = "/static/manager.png";
            img.ariaHidden = "true";
    
            const h2 = document.createElement('h2');
            h2.textContent = "⚙️ Question Manager";
    
            const p = document.createElement('p');
            p.textContent = "Manage quiz questions"; 
            
            const homepageCardItem = document.createElement('li');
            homepageCardItem.id = "card-manager"
            homepageCardItem.className = "bg-pastel-purple";
            homepageCardItem.onclick = () => SPA.navigatePage('manager');
            
            homepageCardItem.appendChild(img);
            homepageCardItem.appendChild(h2);
            homepageCardItem.appendChild(p);
    
            homepageCardList.appendChild(homepageCardItem);
        } else{
            // don't even bother to render the manager button
        }
    } else {
        // don't render manager button
    }
}