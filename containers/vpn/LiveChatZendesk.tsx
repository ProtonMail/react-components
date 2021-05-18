import React, { useEffect, useState, useRef } from 'react';
import { getRelativeApiHostname } from 'proton-shared/lib/helpers/url';
import { useConfig } from '../../hooks';

const getIframeUrl = (apiUrl: string, zendeskKey: string) => {
    const url = new URL(apiUrl, window.location.origin);
    url.hostname = getRelativeApiHostname(url.hostname);
    url.pathname = '/core/v4/resources/zendesk';
    url.searchParams.set('Key', zendeskKey);
    return url;
};
interface Props {
    zendeskKey: string;
}
const LiveChatZendesk = ({ zendeskKey }: Props) => {
    const { API_URL } = useConfig();
    const [style, setStyle] = useState<any>({ position: 'absolute', bottom: 0, right: 0 });
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const iframeUrl = getIframeUrl(API_URL, zendeskKey);

    const src = iframeUrl.toString();
    const targetOrigin = iframeUrl.origin;

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const contentWindow = iframeRef.current?.contentWindow;
            const { origin, data, source } = event;
            if (!contentWindow || origin !== targetOrigin || !data || source !== contentWindow) {
                return;
            }

            if (data.type === 'rect') {
                const height = event.payload.height;
                const width = event.payload.width;
                setStyle({ ...style, height: `${height}px`, width: `${width}px` });
            }
        };

        window.addEventListener('message', handleMessage, false);
        return () => {
            window.removeEventListener('message', handleMessage, false);
        };
    }, []);

    return <iframe
        title="Zendesk"
        src={src}
        style={style}
        ref={iframeRef}
        sandbox="allow-scripts allow-same-origin allow-popups"
    />;
}
export default LiveChatZendesk;
