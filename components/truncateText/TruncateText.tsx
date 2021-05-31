import React, { useState } from 'react';
import { c } from 'ttag';
import { Button } from '../button';

interface Props {
    children: string;
    maxChars: number;
}

const TruncateText = ({ children, maxChars }: Props) => {
    const [isShowingMore, setIsShowingMore] = useState(false);
    const childLength = children.length;
    const lengthToShow = isShowingMore ? childLength : maxChars;

    const handleClick = () => setIsShowingMore((prevState) => !prevState);

    return (
        <>
            {children.substr(0, lengthToShow)}{' '}
            {childLength > maxChars && (
                <Button shape="link" color="norm" onClick={handleClick} style={{ verticalAlign: 'baseline' }}>
                    {isShowingMore ? c('Action').t`Show less` : c('Action').t`Show more`}…
                </Button>
            )}
        </>
    );
};

export default TruncateText;
