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
