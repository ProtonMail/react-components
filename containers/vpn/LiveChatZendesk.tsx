import React, { useEffect, useState, useRef, MutableRefObject, useImperativeHandle } from 'react';
import { getRelativeApiHostname } from 'proton-shared/lib/helpers/url';
import { UserModel } from 'proton-shared/lib/interfaces';
import { useConfig } from '../../hooks';

const getIframeUrl = (apiUrl: string, zendeskKey: string) => {
    const url = new URL(apiUrl, window.location.origin);
    url.hostname = getRelativeApiHostname(url.hostname);
    url.pathname = '/core/v4/resources/zendesk';
    url.searchParams.set('Key', zendeskKey);
    return url;
};

export interface ZendeskRef {
    run: (data: object) => void;
    show: () => void;
}

interface Props {
    zendeskKey: string;
    zendeskRef?: MutableRefObject<ZendeskRef | undefined>;
    user: UserModel;
}

const LiveChatZendesk = ({ zendeskKey, zendeskRef, user }: Props) => {
    const { API_URL } = useConfig();
    const [style] = useState<any>({ position: 'absolute', bottom: 0, right: 0, width: '374px', height: '572px' });
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const iframeUrl = getIframeUrl(API_URL, zendeskKey);

    const src = iframeUrl.toString();
    const targetOrigin = iframeUrl.origin;

    const handleRun = (data: object) => {
        const contentWindow = iframeRef.current?.contentWindow;
        if (!contentWindow) {
            return;
        }
        contentWindow.postMessage(data, targetOrigin);
    };

    const handleShow = () => {
        handleRun({ toggle: true });
    };

    useImperativeHandle(zendeskRef, () => ({
        run: handleRun,
        show: handleShow,
    }));

    useEffect(() => {
        // TODO: Do this after it's been loaded
        setTimeout(() => {
            handleRun({ identify: { name: user.DisplayName || user.Name } });
        }, 3000);
    }, []);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const contentWindow = iframeRef.current?.contentWindow;
            const { origin, data, source } = event;
            if (!contentWindow || origin !== targetOrigin || !data || source !== contentWindow) {
                // return;
            }
        };

        window.addEventListener('message', handleMessage, false);
        return () => {
            window.removeEventListener('message', handleMessage, false);
        };
    }, []);

    return (
        <iframe
            title="Zendesk"
            src={src}
            style={style}
            ref={iframeRef}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
    );
};
export default LiveChatZendesk;
