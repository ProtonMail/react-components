import React, { MouseEvent } from 'react';
import { c } from 'ttag';
import { textToClipboard } from 'proton-shared/lib/helpers/browser';

import { Icon } from '../icon';
import { Tooltip } from '../tooltip';
import { classnames } from '../../helpers';
import Button, { ButtonProps } from './Button';

interface Props extends ButtonProps {
    value: string;
    className?: string;
    onCopy?: () => void;
}

const Copy = ({ value, className = '', onCopy, ...rest }: Props) => {
    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        textToClipboard(value, e.currentTarget);
        onCopy?.();
    };

    return (
        <Button
            onClick={handleClick}
            className={classnames(['relative', className])}
            icon={
                <Tooltip className="increase-click-surface" title={c('Label').t`Copy`}>
                    <Icon name="attach" alt={c('Label').t`Copy`} />
                </Tooltip>
            }
            {...rest}
        />
    );
};

export default Copy;
