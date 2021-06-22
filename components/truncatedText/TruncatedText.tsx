import React, { useState } from 'react';
import { c } from 'ttag';

import { truncate } from 'proton-shared/lib/helpers/string';

import { InlineLinkButton } from '../button';

interface Props {
    children: string;
    maxChars: number;
}

const TruncatedText = ({ children, maxChars }: Props) => {
    const [isShowingMore, setIsShowingMore] = useState(false);
    const childLength = children.length;
    const lengthToShow = isShowingMore ? childLength : maxChars;

    return (
        <>
            {isShowingMore ? children : truncate(children, lengthToShow)}{' '}
            {childLength > maxChars && (
                <InlineLinkButton
                    color="norm"
                    onClick={() => setIsShowingMore((prevState) => !prevState)}
                    className="align-baseline"
                >
                    {isShowingMore ? c('Action').t`Show less` : c('Action').t`Show more`}
                </InlineLinkButton>
            )}
        </>
    );
};

export default TruncatedText;
