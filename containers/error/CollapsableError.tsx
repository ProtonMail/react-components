import React, { ReactNode, useState } from 'react';
import { c } from 'ttag';

import { getLightOrDark } from 'proton-shared/lib/themes/helpers';
import errorImgLight from 'design-system/assets/img/shared/generic-error.svg';
import errorImgDark from 'design-system/assets/img/shared/generic-error-dark.svg';

import IllustrationPlaceholder from '../illustration/IllustrationPlaceholder';
import { Bordered, Icon, SmallButton } from '../../index';

interface Props {
    className?: string;
    error?: Error;
    children?: ReactNode;
}

const CollapsableError = ({ className, error }: Props) => {
    const errorImg = getLightOrDark(errorImgLight, errorImgDark);
    const [isOpen, setIsOpen] = useState(false);
    return (
        <IllustrationPlaceholder
            className={className}
            title={c('Error message').t`Oops, something went wrong`}
            url={errorImg}
        >
            <span>{c('Error message').t`Brace yourself till we get the error fixed.`}</span>
            <span>{c('Error message').t`You may also refresh the page or try again later.`}</span>

            {error ?
                <div className="mt1">
                    <SmallButton
                        key="expand"
                        icon={<Icon name="caret" className={isOpen ? 'rotateX-180' : undefined} />}
                        onClick={() => setIsOpen(!isOpen)}
                    />
                    {error.name}
                    {isOpen ? (
                        <Bordered>
                            <div>{error.message}</div>
                            <div>{error.stack}</div>
                        </Bordered>
                    ): null}
                </div>
             : null}
        </IllustrationPlaceholder>
    );
};

export default CollapsableError;
