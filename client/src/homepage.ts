import { getLocalStorageItem } from "./storage";
import { api } from "./api";
import { User } from "common/models";

export function initHomePage() {
    let welcomeHeaderElement = document.getElementById("welcome-heading");
    let user = getLocalStorageItem<User>("user");
    if (welcomeHeaderElement) {
        if (user) {
        welcomeHeaderElement.textContent = `Welcome, ${user.name}!`;
        } else {
            welcomeHeaderElement.textContent = "Welcome!";
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
    
            const h2_questions = document.createElement('h2');
            h2_questions.textContent = "⚙️ Question Manager";

            const p_questions = document.createElement('p');
            p_questions.textContent = "Manage quiz questions"; 
            
            const questionCardItem = document.createElement('li');
            questionCardItem.id = "card-manager"
            questionCardItem.className = "bg-pastel-purple";
            questionCardItem.onclick = () => SPA.navigatePage('manager');
            
            questionCardItem.appendChild(img);
            questionCardItem.appendChild(h2_questions);
            questionCardItem.appendChild(p_questions);

            const h2_users = document.createElement('h2');
            h2_users.textContent = "🙋 Users";
            
            const p_users = document.createElement('p');
            p_users.textContent = "Manage users"; 

            const userCardItem = document.createElement('li');
            userCardItem.id = "card-users"
            userCardItem.className = "bg-pastel-purple";
            userCardItem.onclick = () => SPA.navigatePage('user_tables');

            userCardItem.appendChild(img.cloneNode());
            userCardItem.appendChild(h2_users);
            userCardItem.appendChild(p_users);
            
            homepageCardList.appendChild(questionCardItem);
            homepageCardList.appendChild(userCardItem);
        } else{
            // don't even bother to render the manager button
        }
    } else {
        // don't render manager button
    }
}