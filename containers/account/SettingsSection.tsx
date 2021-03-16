import React from 'react';
import { classnames } from '../../helpers';

import './SettingsSection.scss';

const SettingsSection = ({ className, ...rest }: React.ComponentPropsWithoutRef<'div'>) => {
    return <div className={classnames(['settings-section', className])} {...rest} />;
};

export default SettingsSection;
