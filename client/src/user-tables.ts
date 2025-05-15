import { api } from "./api";
import { User } from "common/models";

export async function initUserTable() {
    const users = await api.getUsers();
    populateTable(users);
}


function populateTable(users: User[]) {
  if (users.length === 0) return;

  const template = document.getElementById("user-table-template") as HTMLTemplateElement;
  const clone = template.content.cloneNode(true) as DocumentFragment;

  const table = clone.querySelector("table")!;
  const thead = table.querySelector("thead")!;
  const tbody = table.querySelector("tbody")!;

  const headerRow = document.createElement("tr");

  const headers  = Object.keys(users[0]) as (keyof User)[];
  headers.forEach((key:string) => {
    const th = document.createElement("th");
    if (key === 'role_name') {
      let role = key.split('_');
      th.textContent = role[0].charAt(0).toUpperCase() + role[0].slice(1);
    } else {
      th.textContent = key[0].toUpperCase() + key.slice(1);
    }
    headerRow.appendChild(th);
  });

  const actionTh = document.createElement("th");
  actionTh.textContent = "Actions";
  headerRow.appendChild(actionTh);
  thead.appendChild(headerRow);
  
  let currentUser = JSON.parse(localStorage.getItem('user') || 'null');
  users.forEach((user: User) => {
    const tr = document.createElement("tr");
    headers.forEach((key: string) => {
      const td = document.createElement("td");
      if (key === 'role_name') {
        if (user[key as keyof User] === null) {
          td.textContent = 'User';
        } else {
          td.textContent = user[key as keyof User]?.toString() ?? '';
        }
      } else {
        td.textContent = user[key as keyof User]?.toString() ?? '';
      }
      tr.appendChild(td);
    });

    const actionsTd = document.createElement("td");
    if (currentUser.googleId !== user.googleId) {
        const btn = document.createElement("button");
        btn.textContent = user.role_name === 'Manager' ? "Demote": 'Promote';
        btn.style.backgroundColor =  user.role_name === 'Manager' ? "#EF4444": '#10B981';
        btn.className = "edit-btn";
        btn.onclick = async (event: any) => {
          const button = event.currentTarget as HTMLButtonElement;
          const roleIndex = headers.indexOf('role_name');
          const roleTd = tr.children[roleIndex] as HTMLTableCellElement;
      
          const isDemote = button.textContent === 'Demote';
          const makeManager = !isDemote;

          const successfulUpdate = await api.updateManagerStatus(user.userId, makeManager);
          if (successfulUpdate) {
            button.textContent = makeManager ? 'Demote' : 'Promote';
            button.style.backgroundColor = makeManager ? '#EF4444' : '#10B981';
            roleTd.textContent = makeManager ? 'Manager' : 'User';
          }
        }; 
        actionsTd.appendChild(btn);
        tr.appendChild(actionsTd);
    }
    
    tbody.appendChild(tr);
  });

  const container = document.getElementById("table-container")!;
  container.appendChild(clone);
}


