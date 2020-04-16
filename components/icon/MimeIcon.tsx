import React from 'react';
import Icon from './Icon';
import { classnames } from '../../helpers/component';

interface Props {
    name: string;
    className?: string;
}

const MimeIcon = ({ name, className }: Props) => {
    return (
        <Icon
            name={`#mime-${name}`}
            className={classnames(['flex-item-noshrink', className])}
            size={25}
            viewBox="0 0 24 24"
        />
    );
};

export default MimeIcon;
