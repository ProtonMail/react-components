import React from 'react';

import { classnames } from '../../helpers/component';

interface Props {
    children?: React.ReactNode;
    className?: string;
}

const TopNavbar = ({ children, className = '' }: Props) => {
    const navIcons = React.Children.toArray(children).filter((child) => React.isValidElement(child)).length;

    return (
        <div
            className={classnames([
                'flex flex-justify-end topnav-container onmobile-no-flex flex-item-centered-vert flex-item-fluid',
                className
            ])}
        >
            <ul
                className={classnames([
                    'topnav-list unstyled mt0 mb0 ml1 flex flex-nowrap flex-items-center',
                    navIcons >= 4 && 'topnav-list--four-elements'
                ])}
            >
                {React.Children.map(children, (child) => {
                    return (
                        React.isValidElement(child) && (
                            <li className="flex-item-noshrink">
                                {React.cloneElement(child, {
                                    className: 'topnav-link inline-flex flex-nowrap nodecoration'
                                })}
                            </li>
                        )
                    );
                })}
            </ul>
        </div>
    );
};

export default TopNavbar;
