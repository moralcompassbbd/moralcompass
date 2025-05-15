import { User } from "common/models";

export async function initUserTable() {
    // const users = await fetch("/users")
    //   .then(res => res.json());

    const users: User[] = [
  {
    userId: 1,
    googleId: "google-123",
    email: "alice@example.com",
    name: "Alice Johnson"
  },
  {
    userId: 2,
    googleId: "google-456",
    email: "bob@example.com",
    name: "Bob Smith"
  },
  {
    userId: 3,
    googleId: "google-789",
    email: "charlie@example.com",
    name: "Charlie Brown"
  },
  {
    userId: 4,
    googleId: "google-101",
    email: "diana@example.com",
    name: "Diana Prince"
  },
  {
    userId: 5,
    googleId: "google-112",
    email: "evan@example.com",
    name: "Evan Lee"
  },
   {
    userId: 1,
    googleId: "google-123",
    email: "alice@example.com",
    name: "Alice Johnson"
  },
  {
    userId: 2,
    googleId: "google-456",
    email: "bob@example.com",
    name: "Bob Smith"
  },
  {
    userId: 3,
    googleId: "google-789",
    email: "charlie@example.com",
    name: "Charlie Brown"
  },
  {
    userId: 4,
    googleId: "google-101",
    email: "diana@example.com",
    name: "Diana Prince"
  },
  {
    userId: 5,
    googleId: "google-112",
    email: "evan@example.com",
    name: "Evan Lee"
  },
   {
    userId: 1,
    googleId: "google-123",
    email: "alice@example.com",
    name: "Alice Johnson"
  },
  {
    userId: 2,
    googleId: "google-456",
    email: "bob@example.com",
    name: "Bob Smith"
  },
  {
    userId: 3,
    googleId: "google-789",
    email: "charlie@example.com",
    name: "Charlie Brown"
  },
  {
    userId: 4,
    googleId: "google-101",
    email: "diana@example.com",
    name: "Diana Prince"
  },
  {
    userId: 5,
    googleId: "google-112",
    email: "evan@example.com",
    name: "Evan Lee"
  }
];


    populateTable(users);
}

function populateTableHeader(users: User[]) {
  const table = document.getElementById('user-table') as HTMLTableElement;
  const oldThead = table.querySelector("thead");
  if (!oldThead || users.length === 0) return;

  const newThead = oldThead.cloneNode(false);
  const tr = document.createElement("tr");

  const headers = Object.keys(users[0]);

  headers.forEach((key) => {
    const th = document.createElement("th");
    th.textContent = key[0].toUpperCase() + key.slice(1);
    tr.appendChild(th);
  });

  // Add static "Actions" column
  const actionTh = document.createElement("th");
  actionTh.textContent = "Actions";
  tr.appendChild(actionTh);

  newThead.appendChild(tr);
  table.replaceChild(newThead, oldThead);
}

function populateTable(users: User[]) {
    populateTableHeader(users)
    const tbody = document.getElementById('user-table')

    users.forEach((user) => {
        const tr = document.createElement("tr");
        const userIdTd = document.createElement("td");
        userIdTd.textContent = user.userId.toString();
        tr.appendChild(userIdTd);

        const googleIdTd = document.createElement("td");
        googleIdTd.textContent = user.googleId;
        tr.appendChild(googleIdTd);

        const emailTd = document.createElement("td");
        emailTd.textContent = user.email;
        tr.appendChild(emailTd);

        const nameTd = document.createElement("td");
        nameTd.textContent = user.name;
        tr.appendChild(nameTd);

        const actionsTd = document.createElement("td");
        const btn = document.createElement("button");
        btn.textContent = "Edit";
        btn.className = 'edit-btn';
         btn.onclick = () => showEditUserStatusForm(user);
        actionsTd.appendChild(btn);
        tr.appendChild(actionsTd);

        tbody?.appendChild(tr);
    });
}

export const showEditUserStatusForm = (user: User) => {
  const dialog = document.getElementById('edit-user-status-dialog') as HTMLDialogElement;
  const nameDisplay = document.getElementById('user-name-display');

  if (nameDisplay) {
    nameDisplay.textContent = `User: ${user.name}`;
  }
  dialog.showModal();
};
