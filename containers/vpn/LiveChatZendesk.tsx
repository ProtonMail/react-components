import React, { useEffect, useState, useRef, MutableRefObject, useImperativeHandle } from 'react';
import { getRelativeApiHostname } from 'proton-shared/lib/helpers/url';
import { useConfig } from '../../hooks';

// The sizes for these are hardcoded since the widget calculates it based on the viewport, and since it's in
// an iframe it needs to have something reasonable.
// The main chat widget.
const OPENED_SIZE = {
    height: `${572 / 16}rem`,
    width: `${374 / 16}rem`,
};
// The small button to toggle the chat.
const CLOSED_SIZE = {
    height: `${70 / 16}rem`,
    width: `${140 / 16}rem`,
};

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
    name?: string;
    email?: string;
    onLoaded: () => void;
    locale: string;
}

const LiveChatZendesk = ({ zendeskKey, zendeskRef, name, email, onLoaded, locale }: Props) => {
    const { API_URL } = useConfig();
    const [style, setStyle] = useState({
        position: 'absolute',
        bottom: 0,
        right: 0,
        maxHeight: '100%',
        maxWidth: '100%',
        ...CLOSED_SIZE,
    });
    const [loaded, setLoaded] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const pendingLoadingRef = useRef<{ show?: boolean; locale?: string }>({});

    const iframeUrl = getIframeUrl(API_URL, zendeskKey);

    const src = iframeUrl.toString();
    const targetOrigin = iframeUrl.origin;

    const handleRun = (data: object) => {
        const contentWindow = iframeRef.current?.contentWindow;
        if (!contentWindow || !loaded) {
            return;
        }
        contentWindow.postMessage(data, targetOrigin);
    };

    const handleShow = () => {
        pendingLoadingRef.current.show = true;
        handleRun({ toggle: true });
    };

    useImperativeHandle(zendeskRef, () => ({
        run: handleRun,
        show: handleShow,
    }));

    useEffect(() => {
        if (!loaded) {
            return;
        }
        handleRun({ prefill: { name: { value: name, readOnly: true }, email: { value: email, readOnly: true } } });
    }, [loaded, name, email]);

    useEffect(() => {
        if (!loaded) {
            return;
        }
        handleRun({ setLocale: locale });
    }, [loaded, locale]);

    useEffect(() => {
        if (!loaded || !pendingLoadingRef.current) {
            return;
        }
        const oldPending = pendingLoadingRef.current;
        pendingLoadingRef.current = {};
        if (oldPending.show) {
            handleShow();
        }
    }, [loaded]);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const contentWindow = iframeRef.current?.contentWindow;
            const { origin, data, source } = event;
            if (!contentWindow || origin !== targetOrigin || !data || source !== contentWindow) {
                return;
            }
            if (data.type === 'on') {
                if (data.payload === 'open') {
                    setStyle((oldStyle) => ({ ...oldStyle, ...OPENED_SIZE }));
                }
                if (data.payload === 'close') {
                    setStyle((oldStyle) => ({ ...oldStyle, ...CLOSED_SIZE }));
                }
            }
            if (data.type === 'loaded') {
                onLoaded();
                setLoaded(true);
                contentWindow.postMessage(
                    { updateSettings: { webWidget: { color: { theme: '#02811A' } } } },
                    targetOrigin
                );
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
