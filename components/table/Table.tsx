import React from 'react';

import { classnames } from '../../helpers';
import Scroll from '../scroll/Scroll';

interface Props extends React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement> {
    children: React.ReactNode;
    className?: string;
    caption?: string;
}

const Table = ({ children, className, caption, ...props }: Props) => {
    return (
        <Scroll horizontal>
            <table className={classnames(['simple-table', className])} {...props}>
                {caption ? <caption className="sr-only">{caption}</caption> : null}
                {children}
            </table>
        </Scroll>
    );
};

export default Table;
