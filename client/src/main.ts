
export function handleCredentialResponse(response: any) {
    fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: response.credential })
    })
    .then(res => res.json())
    .then((data) => {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("jwt", data.jwt);
        SPA.navigatePage('homepage', { name: data.user.name});
    })
    .catch(error => alert(error));
}
