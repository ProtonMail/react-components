import React, { useState } from 'react';
import { c } from 'ttag';

import { truncate } from 'proton-shared/lib/helpers/string';

import { Button } from '../button';

interface Props {
    children: string;
    maxChars: number;
}

const TruncateText = ({ children, maxChars }: Props) => {
    const [isShowingMore, setIsShowingMore] = useState(false);
    const childLength = children.length;
    const lengthToShow = isShowingMore ? childLength : maxChars;

    return (
        <>
            {truncate(children, lengthToShow)}{' '}
            {childLength > maxChars && (
                <Button
                    shape="link"
                    color="norm"
                    onClick={() => setIsShowingMore((prevState) => !prevState)}
                    style={{ verticalAlign: 'baseline' }}
                >
                    {isShowingMore ? c('Action').t`Show less` : c('Action').t`Show more`}
                </Button>
            )}
        </>
    );
};

export default TruncateText;
