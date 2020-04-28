import React, { useEffect } from 'react';

interface Props {
    title: string;
    children: React.ReactNode;
    head?: React.ReactNode;
    className?: string;
    sandbox?: string;
    onMessage: (event: MessageEvent) => void;
}

import Frame from './Frame';

const SignupFrame = ({ title, head, children, className, sandbox, onMessage }: Props) => {
    useEffect(() => {
        window.addEventListener('message', onMessage);

        return () => {
            window.removeEventListener('message', onMessage);
        };
    }, []);

    return (
        <Frame title={title} sandbox={sandbox} head={head} className={className}>
            {children}
            <script src="https://mail.protonmail.com/api/challenge/js?Type=1"></script>
        </Frame>
    );
};

export default SignupFrame;
