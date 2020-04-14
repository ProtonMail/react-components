import React, { ReactNode } from 'react';

import Icon from '../icon/Icon';

import { classnames } from '../../helpers/component';
import { useActiveBreakpoint } from 'react-components';

interface Props {
    icon?: string;
    iconColor?: string;
    text?: ReactNode;
    aside?: ReactNode;
}

const SidebarItemContent = ({ icon, iconColor, text, aside }: Props) => {
    const { isNarrow } = useActiveBreakpoint();
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
                    !isNarrow && 'is-hidden-when-sidebar-is-collapsed'
                    // if we put this, it does not work for folders in collapsed view (but is okay with Inbox/labels)
                    // if we don't, it does not work for Inbox/Labels/etc.
                ])}
            >
                {text}
            </span>
            {aside && (
                <span
                    className={classnames([
                        'flex flex-items-center',
                        !isNarrow && 'is-hidden-when-sidebar-is-collapsed'
                    ])}
                >
                    {aside}
                </span>
            )}
        </span>
    );
};

export default SidebarItemContent;
