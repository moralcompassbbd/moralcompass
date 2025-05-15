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
        const homepageCardList = document.querySelector(".homepage-card-list");

        if(homepageCardList){
            const img = document.createElement('img');
            img.src = "/static/manager.png";
            img.alt = "manager-img";
    
            const h2 = document.createElement('h2');
            h2.textContent = "⚙️ Question Manager";
    
            const p = document.createElement('p');
            p.textContent = "Manage quiz questions"; 
            
            const cardLink = document.createElement('article');
            cardLink.className = "card-link";
            cardLink.onclick = () => SPA.navigatePage('manager');
    
            cardLink.appendChild(img);
            cardLink.appendChild(h2);
            cardLink.appendChild(p);
    
            const homepageCardItem = document.createElement('li');
            homepageCardItem.className = "homepage-card-item";
            homepageCardItem.style.backgroundColor = "#a3d7bd";
    
            homepageCardItem.appendChild(cardLink);
    
            homepageCardList.appendChild(homepageCardItem);
        } else{
            // don't even bother to render the manager button
        }
    } else {
        // don't render manager button
    }
}