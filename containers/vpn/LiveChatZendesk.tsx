import { useEffect } from 'react';
import { func, string } from 'prop-types';
import { UserModel } from 'proton-shared/lib/interfaces';

declare global {
    interface Window {
        zE: any;
        zESettings: any;
    }
}

const insertScript = ({ key, onLoaded }: { key: string; onLoaded: any }) => {
    const script = document.createElement('script');
    script.async = true;
    script.id = 'ze-snippet';
    script.src = `https://static.zdassets.com/ekr/snippet.js?key=${key}`;
    script.addEventListener('load', onLoaded);
    document.body.appendChild(script);
};

const removeScript = () => {
    const elements = [
        document.querySelector('#ze-snippet'),
        document.querySelector('iframe[data-product="web_widget"]'),
        document.querySelector('iframe#webWidget')?.parentNode,
    ];
    elements.forEach((element) => (element as HTMLElement)?.remove());
    delete window.zE;
    delete window.zESettings;
};

const setIdentify = (user: UserModel) => {
    if (window.zE) {
        window.zE('webWidget', 'identify', {
            name: user.Name,
            email: user.Email,
        });
    }
};

// const showWidget = () => {
//     if (window.zE) {
//         window.zE('webWidget', 'show');
//     }
// };

const showWidget = (show: boolean) => {
    const command = show ? 'show' : 'hide';
    if (window.zE) {
        window.zE('webWidget', command);
    }
};

const LiveChatZendesk = ({ zendeskKey, user = {}, onLoad = undefined, ...props }: any) => {
    const onLoaded = () => {
        setIdentify(user);
        showWidget(false);
        if (onLoad) {
            onLoad();
        }
    };

    useEffect(() => {
        if (!window.zE) {
            insertScript({ key: zendeskKey, onLoaded });
            window.zESettings = props;
            // showWidget()
        }
        return removeScript;
    }, []);

    // useEffect(() => {
    //     setIdentify(user);
    // }, [user]);

    return null;
};

LiveChatZendesk.propTypes = {
    zendeskKey: string.isRequired,
    onLoad: func,
};

LiveChatZendesk.defaultProps = {
    onLoad: null,
};

export default LiveChatZendesk;
