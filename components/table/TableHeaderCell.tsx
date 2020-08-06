import React from 'react';
import { SORT_DIRECTION } from 'proton-shared/lib/constants';
import { Icon } from '../..';

interface Props extends React.ThHTMLAttributes<HTMLTableHeaderCellElement> {
    children: React.ReactNode;
    direction?: SORT_DIRECTION;
    onSort?: () => {};
}

const TableHeaderCell = ({ children, direction, onSort, ...rest }: Props) => {
    const content = onSort ? (
        <div className="flex-nowrap inline-flex-vcenter">
            <span className="link mr0-5" onClick={onSort}>
                {children}
            </span>
            {direction ?? (
                <Icon
                    name="caret"
                    className={`flex-item-noshrink ${direction === SORT_DIRECTION.DESC ? '' : 'rotateX-180'}`}
                />
            )}
        </div>
    ) : (
        children
    );

    return (
        <th scope="col" {...rest}>
            {content}
        </th>
    );
};

export default TableHeaderCell;
