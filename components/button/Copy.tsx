import React, { MouseEvent } from 'react';
import { c } from 'ttag';
import { textToClipboard } from 'proton-shared/lib/helpers/browser';
import { Icon } from '../icon';
import { Tooltip } from '../tooltip';
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
        <Button onClick={handleClick} className={className} {...rest}>
            <Tooltip className="flex" title={c('Label').t`Copy`}>
                <Icon name="clipboard" />
                <span className="sr-only">{c('Label').t`Copy`}</span>
            </Tooltip>
        </Button>
    );
};

export default Copy;
