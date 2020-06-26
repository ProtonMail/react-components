import React from 'react';
import { classnames } from '../../helpers/component';

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    children?: React.ReactNode;
    className?: string;
}

const RowVertical = ({ children, className = '', ...rest }: Props) => {
    return (
        <div className={classnames(['flex flex-column mb1', className])} {...rest}>
            {children}
        </div>
    );
};

export default RowVertical;
