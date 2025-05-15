import { deleteLocalStorageItem, storeLocalStorageItem } from './storage';

export function handleCredentialResponse(response: any) {
    fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: response.credential })
    })
    .then(res => res.json())
    .then((data) => {
        storeLocalStorageItem("user", JSON.stringify(data.user));
        storeLocalStorageItem("jwt", data.jwt);
        SPA.navigatePage('homepage', { name: data.user.name});
    })
    .catch(error => alert(error));
}

export const displayConfirmLogoutModal = async() => {
  const dialog = document.getElementById('logout-confirmation-dialog') as HTMLDialogElement;
      
  dialog.showModal();
  const result = await new Promise<string>((resolve) => {
      dialog.addEventListener('close', () => {
          resolve(dialog.returnValue);
      }, { once: true });
  });

  if (result === 'confirm') {
    SPA.navigatePage('main');
    deleteLocalStorageItem("jwt");
    deleteLocalStorageItem("user");
  } else{
    // don't logout
  }
}