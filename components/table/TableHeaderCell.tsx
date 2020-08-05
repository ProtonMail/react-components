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
        <SortingTableCellHeader onClick={onSort} direction={direction}>
            {children}
        </SortingTableCellHeader>
    ) : (
        children
    );

    return (
        <th scope="col" {...rest}>
            {content}
        </th>
    );
};

interface SortingProps {
    children: React.ReactNode;
    direction?: SORT_DIRECTION;
    onClick: () => {};
}

const SortingTableCellHeader = ({ children, direction, onClick }: SortingProps) => {
    return (
        <div className="flex-nowrap inline-flex-vcenter">
            <span className="link mr0-5" onClick={onClick}>
                {children}
            </span>
            {direction ?? (
                <Icon
                    name="caret"
                    className={`flex-item-noshrink ${direction === SORT_DIRECTION.DESC ? '' : 'rotateX-180'}`}
                />
            )}
        </div>
    );
};

export default TableHeaderCell;
