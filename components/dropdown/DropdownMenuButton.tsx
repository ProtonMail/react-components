import React from 'react';
import { classnames } from '../../helpers/component';

interface Props extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    loading?: boolean;
}

const DropdownMenuButton = ({ className = '', disabled, loading, children, ...rest }: Props) => {
    return (
        <button
            type="button"
            disabled={disabled || loading}
            className={classnames(['dropDown-item-button w100 pr1 pl1 pt0-5 pb0-5', className])}
            {...rest}
        >
            {children}
        </button>
    );
};

export default DropdownMenuButton;
