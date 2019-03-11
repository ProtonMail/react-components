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

