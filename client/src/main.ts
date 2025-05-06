
function clickGoogleButton(event: MouseEvent) {
    event.preventDefault();
    console.log('Form submitted!');
    navigatePage('homepage');
}

globalThis.clickGoogleButton = clickGoogleButton;
