import React from 'react';
import { c } from 'ttag';

import Input, { Props as InputProps } from '../../components/input/Input';

const GiftCodeInput = ({ value, ...rest }: InputProps) => {
    return <Input placeholder={c('Placeholder').t`Gift code`} value={value} {...rest} />;
};

export default GiftCodeInput;
