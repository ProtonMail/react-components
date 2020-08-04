import React, { Ref } from 'react';
import { classnames } from '../../helpers/component';

interface Props {
    children: React.ReactNode;
    className?: string;
    listRef?: Ref<HTMLUListElement>;
    type?: string;
}

const DropdownMenu = ({ children, className = '', type = '', listRef }: Props) => {
    return (
        <ul className={classnames(['unstyled mt0 mb0', className])} ref={listRef}>
            {React.Children.toArray(children).map((child, i) => {
                return React.isValidElement(child) ? (
                    <li
                        className={classnames([
                            'dropDown-item',
                            type === 'delete' && 'dropDown-item--delete',
                            child.props.liClassName,
                        ])}
                        key={child.key || i}
                    >
                        {child}
                    </li>
                ) : null;
            })}
        </ul>
    );
};

export default DropdownMenu;
