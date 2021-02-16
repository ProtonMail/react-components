import React from 'react';

import { classnames } from '../../helpers';
import './SettingsSectionWide.scss';

const SettingsSectionWide = ({ className, ...rest }: React.ComponentPropsWithoutRef<'div'>) => {
    return <div className={classnames(['settings-section-wide', className])} {...rest} />;
};

export default SettingsSectionWide;
