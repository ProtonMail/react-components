import React from 'react';
import { LearnMore, LearnMoreProps } from '../../components';

interface SettingsParagraphProps extends React.ComponentPropsWithoutRef<'p'> {
    learnMoreUrl?: string;
    learnMoreProps?: Omit<LearnMoreProps, 'url'>;
}

const SettingsParagraph = ({ learnMoreUrl, learnMoreProps, children, ...rest }: SettingsParagraphProps) => {
    const learnMoreElement = learnMoreUrl ? (
        <>
            <br />
            <LearnMore url={learnMoreUrl} {...learnMoreProps} />
        </>
    ) : null;

    return (
        <p style={{ maxWidth: 600 }} {...rest}>
            {children}
            {learnMoreElement}
        </p>
    );
};

export default SettingsParagraph;
