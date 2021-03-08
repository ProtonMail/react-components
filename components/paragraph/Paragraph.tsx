import React, { ReactNode } from 'react';
import { classnames } from '../../helpers';

interface Props {
    children: ReactNode;
    className?: string;
}

const Paragraph = ({ className = '', children }: Props) => {
    return <div className={classnames(['pt1 pb1', className])}>{children}</div>;
};

export default Paragraph;
