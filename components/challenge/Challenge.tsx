import React, { useState } from 'react';
import { c } from 'ttag';
import ChallengeFrame, { Props as ChallengeProps } from './ChallengeFrame';
import { Alert, Href, Loader } from '../../index';

const Challenge = ({ children, style, ...rest }: Omit<ChallengeProps, 'src'>) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const supportTeam = (
        <Href url="https://protonmail.com/support-form" title="Contact the ProtonMail support team.">
            {c('Info').t`support team`}
        </Href>
    );

    return (
        <div style={style}>
            {isLoading ? <Loader /> : null}

            {hasError ? (
                <>
                    <Alert type="error">
                        {c('Error')
                            .jt`Something went wrong, please refresh the page in order to proceed. If you still see this error message please contact our ${supportTeam}.`}
                    </Alert>
                </>
            ) : (
                <ChallengeFrame
                    src="https://suspicious-swanson-dbc169.netlify.app/challenge.html"
                    className={isLoading || hasError ? 'hidden' : 'w100'}
                    innerClassName="flex-item-fluid-auto"
                    bodyClassName="color-black bg-white"
                    style={style}
                    onLoaded={() => {
                        setIsLoading(false);
                    }}
                    onError={() => {
                        setHasError(true);
                        setIsLoading(false);
                    }}
                    {...rest}
                >
                    {children}
                </ChallengeFrame>
            )}
        </div>
    );
};

export default Challenge;
