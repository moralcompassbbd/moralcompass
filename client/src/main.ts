import { storeLocalStorageItem } from "storage";

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
