# Moral Compass

## Development

```sh
# in server directory trigger
npm run dev
```

## Client
Pages can be registered in the client by adding it as a template in the following format to `index.handlebars`:

```html
<template class="page-template" data-page="page-mypage">
    <main>
        <h1>Hello, world!</h1>
    </main>
</template>
```

For convenience sake all files in the `partials` directory will be registered as Handlebars partials, so you can put the contents of the page in separate file. For example:

```html
<!-- index.handlebars -->
<template class="page-template" data-page="page-mypage">{{> mypage }}</template>
<!-- partials/mypage.handlebars -->
<main>
    <h1>Hello, world!</h1>
</main>
```

Then you can navigate to a page by calling, either with or without props:
```js
SPA.navigate('mypage');
SPA.navigate('mypage', { name: 'me' });
```

The navigate function simply reads the innerHTML of the `template` element and replaces the innerHTML of the root element with it.

The props can be accessed via the `pageProps` in global `SpaClient`, `SPA`. For example:

```ts
function setName() {
    const nameElement = document.getElementById('name');
    const name = SPA.pageProps.name;
    nameElement.innerText = name;
}
```

Handlers must be registerd in `index.ts`.

We can execute JS on page load using `data-onmount` on the template, or we can just use a regular js event handlers.

```html
<!-- index.handlebars -->
<template class="page-template" data-page="page-mypage" data-onmount="SPA.handlers.setName()">{{> mypage }}</template>
<!-- partials/mypage.handlebars -->
<main>
    <h1>Hello, <span id="name">world</span>!</h1>
</main>
```
