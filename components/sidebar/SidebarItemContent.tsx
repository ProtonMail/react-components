import React, { ReactNode } from 'react';

import Icon from '../icon/Icon';
import { classnames } from '../../helpers/component';

interface Props {
    icon?: string;
    iconColor?: string;
    text?: ReactNode;
    aside?: ReactNode;
    isWide: boolean;
}

const SidebarItemContent = ({ icon, iconColor, text, aside, isWide }: Props) => {
    return (
        <span className="flex flex-nowrap w100 flex-items-center">
            {icon && (
                <Icon
                    color={iconColor}
                    name={icon}
                    className="navigation__icon flex-item-noshrink mr0-5 flex-item-centered-vert"
                />
            )}
            <span
                className={classnames([
                    'flex-item-fluid ellipsis mw100',
                    isWide && 'is-hidden-when-sidebar-is-collapsed'
                ])}
            >
                {text}
            </span>
            {aside && <span className={classnames(['flex flex-items-center'])}>{aside}</span>}
        </span>
    );
};

export default SidebarItemContent;
