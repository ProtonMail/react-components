import React from 'react';

import { classnames } from '../../helpers';
import Icon from '../../components/icon/Icon';
import { Button } from '../../components';

interface Props {
    children: React.ReactNode;
    className?: string;
    onClose?: () => void;
}

const TopBanner = ({ children, className, onClose }: Props) => {
    return (
        <div className={classnames(['flex flex-nowrap text-center relative text-bold', className])}>
            <div className="flex-item-fluid p0-5">{children}</div>
            {onClose ? (
                <Button icon shape="ghost" className="flex-item-noshrinkd" onClick={onClose}>
                    <Icon name="off" />
                </Button>
            ) : null}
        </div>
    );
};

export default TopBanner;
