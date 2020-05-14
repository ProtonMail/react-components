import React from 'react';
import { c } from 'ttag';
import PropTypes from 'prop-types';
import { EMAIL_PLACEHOLDER } from 'proton-shared/lib/constants';
import { isEmail } from 'proton-shared/lib/helpers/validators';

import Input from './Input';

const EmailInput = ({ value = '', ...rest }) => {
    const error = isEmail(value) ? '' : c('Error').t`Email address invalid`;
    return <Input type="email" error={error} value={value} placeholder={EMAIL_PLACEHOLDER} {...rest} />;
};

EmailInput.propTypes = {
    value: PropTypes.string
};

export default EmailInput;
