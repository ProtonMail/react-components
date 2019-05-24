[![CircleCI](https://circleci.com/gh/ProtonMail/react-components.svg?style=svg)](https://circleci.com/gh/ProtonMail/react-components)

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

``` js
const api = useApi();
```

### useApiResult
Get parameters `loading`, `result`, `error`, `request` from the API call.

It runs automatically depending on what dependencies are specified. If `[]` is given it's only run on mount. If no dependencies are given it's not run automatically.

where `fn` is passed whatever arguments is passed from `request`, or nothing if run from a dependency change and should return a route config object.

``` js
const { loading, result, error, request } = useApiResult(fn, [dependencies]);
```

### useApiWithoutResult
Get parameters `loading`, `request` from the API call.

Does not run automatically. Intended for `POST`, `PUT` requests where a `loading` indicator is wanted.

``` js
const { loading, result, error, request } = useApiResult(fn);
```

where `fn` is passed whatever arguments is passed from `request` and should return a route config object.

### useAuthenticationStore
Get the `authenticationStore`. Can be used to retrieve the `UID` or the `mailboxPassword`.

``` js
const authenticationStore = useAuthentionStore();
```

### useNotifications
Create notifications to be displayed in the app.

``` js
const { createNotification, removeNotification } = useNotifications();

const handleClick = () => {
    createNotification({ type: 'error', text: 'Failed to update' });
}
```

### useModals
Create a modal.

``` js
const { createModal } = useModals();

const handleClick = async () => {
    const { password, totp } = await new Promise((resolve, reject) => {
        createModal(
            <AskPasswordModal onClose={reject} onSubmit={resolve} />
        );
    });
    // use password
};
```

### useAsync
Get `loading`, `result`, `error` parameters from a promise.

``` js
const { loading, result, error, run } = useAsync();

const handleClick = () => {
    run(promise);
};
```

### useConfig

Get all variables defined in `config.js` file for a dedicated project.

``` js
const { CLIENT_ID, CLIENT_VERSION } = useConfig();
```

### useCachedAsyncResult
Get `result` and `loading` from an async operation that is persisted in the cache. Indexed by a unique key, and re-evaluated whenever the dependencies change.

Note: If the async operation throws, this hook will throw, so wrap the component using this hook with an ErrorBoundary if the error needs to be handled. Otherwise it will be retried when the component renders the next time.

```js
const [result, loading] = useCachedAsyncResult(
    'UNIQUE_KEY',
    () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve('the result')
            }, 1500);
        });
    },
    [dependencies]
);
```
