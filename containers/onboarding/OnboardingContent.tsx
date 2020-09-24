import React from 'react';

interface Props {
    description: string;
    text: string;
    children?: React.ReactNode;
    img: React.ReactNode;
}

const OnboardingContent = ({ description, img, text, children }: Props) => {
    return (
        <>
            <div className="mb1">
                {description}
            </div>
            <div className="aligncenter">
                {img}
            </div>
            <div className="mb1">
                {text}
            </div>
            {children}
        </>
    )
}

export default OnboardingContent;
