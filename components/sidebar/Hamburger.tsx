import React from 'react';
import { c } from 'ttag';
import Icon from '../icon/Icon';
import Button, { ButtonProps } from '../button/Button';

export type ErrorButtonProps = Omit<ButtonProps, 'color'>;

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
    onToggle?: () => void;
    expanded?: boolean;
    sidebarId?: string;
}

const Hamburger = ({ sidebarId, expanded = true, onToggle, ...rest }: Props) => {
    return (
        <Button
            shape="ghost"
            color="weak"
            className="hamburger ml0-5 no-desktop no-tablet"
            aria-expanded={expanded === false ? false : undefined}
            aria-controls={sidebarId}
            onClick={onToggle}
            {...rest}
            title={expanded ? c('Action').t`Close navigation` : c('Action').t`Open navigation`}
            icon
        >
            <Icon
                size={24}
                name={expanded ? 'off' : 'burger'}
                alt={expanded ? c('Action').t`Close navigation` : c('Action').t`Open navigation`}
            />
        </Button>
    );
};

export default Hamburger;
