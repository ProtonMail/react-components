import React from 'react';

import { ButtonProps } from '../button/Button';
import PrimaryButton from '../button/PrimaryButton';
import { classnames } from '../../helpers';

const SidebarPrimaryButton = ({ children, className = '', ...rest }: ButtonProps) => {
    return (
        <PrimaryButton size="large" className={classnames(['text-bold mt0-25 w100', className])} {...rest}>
            {children}
        </PrimaryButton>
    );
};

export default SidebarPrimaryButton;
