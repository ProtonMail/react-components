import React, { useRef, useLayoutEffect, useState } from 'react';
import ReactDOM from 'react-dom';

interface Props {
    title: string;
    children: React.ReactNode;
    head?: React.ReactNode;
    className?: string;
    sandbox?: string;
}

const Frame = ({
    title,
    head,
    children,
    className,
    sandbox = 'allow-scripts allow-same-origin allow-popups allow-top-navigation'
}: Props) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const doc = iframeRef.current ? iframeRef.current.contentDocument : undefined;

    useLayoutEffect(() => {
        const renderFrameContents = () => {
            if (iframeRef.current) {
                const doc = iframeRef.current.contentDocument;

                if (doc?.readyState === 'complete') {
                    setIsLoaded(true);
                } else {
                    setTimeout(renderFrameContents, 0);
                }
            }
        };
        renderFrameContents();
    }, []);

    return (
        <iframe ref={iframeRef} title={title} className={className} sandbox={sandbox} scrolling="no">
            {isLoaded && doc && head ? ReactDOM.createPortal(head, doc.head) : null}
            {isLoaded && doc && children ? ReactDOM.createPortal(children, doc.body) : null}
        </iframe>
    );
};

export default Frame;
