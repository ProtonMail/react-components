import React from 'react';

import { classnames } from '../../helpers/component';
import PrivateMainArea from './PrivateMainArea';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    children: React.ReactNode;
}
const PrivateMainAreaSettings = ({ className, children, ...rest }: Props) => {
    return (
        <PrivateMainArea className={classnames(['', className])} {...rest}>
            {children}
        </PrivateMainArea>
    );
};

export default PrivateMainAreaSettings;
