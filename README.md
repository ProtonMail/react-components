# react-components

## Install

`"github:ProtonMail/react-components.git#semver:~1.0.0"`

> :warning: v.1.0.0 is not available yet, remove #semver for now

### Dependencies

We have 3 peer dependencies:

- react
- react-router-dom
- ttag

## How to use

```js
import { Badge, Alert } from 'react-components';
```

## Remarks
There is an SVG file that is inlined as-is from the design-system.

`design-system/_includes/sprite-icons.svg`

For webpack, it needs to be loaded with the `svg-inline-loader`. The rest of the svg files should be loaded with the `file-loader`.

## Hooks

### useApi
Get the `api` function to perform API calls. In 99% of cases, `useApi` hook *should not be used* because calling the API should required to use at least the `loading` parameter to block the UI.

```
const api = useApi();
```

### useApiResult
Get parameters `loading`, `result`, `error`, `request` from the API call.

It runs automatically depending on what dependencies are specified. If `[]` is given it's only run on mount. If no dependencies are given it's not run automatically.

where `fn` is passed whatever arguments is passed from `request`, or nothing if run from a dependency change and should return a route config object.

```
const { loading, result, error, request } = useApiResult(fn, [dependencies]);
```

### useApiWithoutResult
Get parameters `loading`, `request` from the API call.

Does not run automatically. Intended for `POST`, `PUT` requests where a `loading` indicator is wanted.

```
const { loading, result, error, request } = useApiResult(fn);
```

where `fn` is passed whatever arguments is passed from `request` and should return a route config object.

### useAuthenticationStore
Get the `authenticationStore`. Can be used to retrieve the `UID` or the `mailboxPassword`.

```
const authenticationStore = useAuthentionStore();
```

### useNotifications
Create notifications to be displayed in the app.

```
const { createNotification, removeNotification } = useNotifications();

const handleClick = () => {
    createNotification({ type: 'error', text: 'Failed to update' });
}
```

### usePrompts
Create a prompt. Intended to show a modal asking for user input. Returns a promise.

```
const { createPrompt } = usePrompts();

const handleClick = async () => {
    const password = await createPrompt((resolve, reject) => {
        return <AskPasswordModal onClose={() => reject()} onSubmit={(value) => resolve(value)} />;
    });
    // use password
};

```

### useAsync
Get `loading`, `result`, `error` parameters from a promise.

```
const { loading, result, error, run } = useAsync();

const handleClick = () => {
    run(promise);
};

```


## How to write components ?

### A new component

Let's create the component **fire**, with 3 flavors, we will have
- Fire
- RedFire
- BlueFire
- GreenFire

1. Let's create the dir `./components/fire`
2. Create the main component `index.js` (_it will be exported as_ `Fire`)
3. Create flavors, `{green,red,blue}.js`
4. :tada:

Now when we will export them, it will create 4 exports:
- Fire -> index.js as it's the main component
- RedFire -> red.js as it's a flavor
- BlueFire -> blue.js as it's a flavor
- GreenFire -> greem.js as it's a flavor

ex:
`import { RedFire } from 'react-components';`

### A new component

### Fresh one

Let's create the component **fire**
- Fire

1. Let's create the dir `./components/fire`
2. Create the main component `index.js` (_it will be exported as_ `Fire`)
3. :tada:

Now when we will export them, it will create 1 export:
- Fire -> index.js as it's the main component

ex:
`import { Fire } from 'react-components';`


### From an existing one

Let's add a new flavor of an existing component, **button**

1. Let's open the dir `./components/button`
2. Create the main component `success.js` 
3. :tada:


Now when we will export them, it will create 1 more export:
- SuccessButton -> success.js as it's a flavor

ex:
`import { SuccessButton } from 'react-components';`


### TL;DR

`<componentName>/index.js` => `export { default as ComponentName }`
`<componentName>/<flavor>.js` => `export { default as FlavorComponentName }`

ex:

`button/index.js` => `export { default as Button }`
`button/small.js` => `export { default as SmallButton }`
