import React from 'react';
import { classnames } from '../../helpers/component';

interface Props {
    children: React.ReactNode;
    onTop?: boolean;
}
const SettingsTitle = ({ children, onTop = true }: Props) => {
    return <h1 className={classnames(['sticky-title', onTop && 'sticky-title--onTop'])}>{children}</h1>;
};

export default SettingsTitle;
