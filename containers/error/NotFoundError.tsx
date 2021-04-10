import React from 'react';
import { c } from 'ttag';
import notFoundErrorSvg from 'design-system/assets/img/errors/error-404.svg';
import IllustrationPlaceholder from '../illustration/IllustrationPlaceholder';

const NotFoundError = () => {
    return <IllustrationPlaceholder title={c('Error message').t`Not found`} url={notFoundErrorSvg} />;
};

export default NotFoundError;
