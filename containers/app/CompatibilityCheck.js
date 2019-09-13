import React, { useEffect } from 'react';
import { Href } from 'react-components';
import PropTypes from 'prop-types';
import unsupportedBrowserSettings from 'design-system/assets/img/shared/unsupported-browser-settings.svg';

const isGoodPrngAvailable = () => {
    if (window.crypto && window.crypto.getRandomValues) {
        return true;
    }
    return typeof window.msCrypto === 'object' && typeof window.msCrypto.getRandomValues === 'function';
};

const hasCookies = () => {
    try {
        return navigator.cookieEnabled === true;
    } catch (e) {
        // Safari throws SecurityError if storage is disabled
        return false;
    }
};

const hasSessionStorage = () => {
    try {
        return !!window.sessionStorage;
    } catch (e) {
        // Safari throws SecurityError if storage is disabled
        return false;
    }
};

// Locale is not loaded here so no translations
const compats = [
    {
        name: 'Cookies',
        valid: hasCookies(),
        text: 'Please enable cookies in your browser.'
    },
    {
        name: 'Storage',
        valid: hasSessionStorage(),
        text: 'Please enable sessionStorage in your browser.'
    },
    {
        name: 'PRNG',
        valid: isGoodPrngAvailable(),
        text: 'Please update to a modern browser with support for PRNG.'
    }
];

const compat = compats.every(({ valid }) => valid);

const CompatibilityCheck = ({ children }) => {
    useEffect(() => {
        if (!compat) {
            document.title = 'Compatibility check';
        }
    }, []);

    if (compat) {
        return children;
    }

    const list = compats
        .filter(({ valid }) => !valid)
        .map(({ name, text }, i) => {
            return (
                <li key={i}>
                    {name}: {text}
                </li>
            );
        });

    return (
        <div className="w50 p2 mt2 center big automobile">
            <div className="aligncenter">
                <h1>Compatibility check</h1>
                <p>
                    Proton apps requires a modern web browser with cutting edge support for{' '}
                    <Href className="primary-link" url="http://caniuse.com/#feat=cryptography">
                        WebCrypto (PRNG)
                    </Href>{' '}
                    and{' '}
                    <Href className="primary-link" url="http://caniuse.com/#feat=namevalue-storage">
                        Web Storage
                    </Href>
                    .
                </p>
                <Href
                    className="primary-link bold"
                    url="https://protonmail.com/support/knowledge-base/browsers-supported/"
                >
                    More info
                </Href>
            </div>
            <div className="mt2 aligncenter">
                <img src={unsupportedBrowserSettings} alt="Compatibility check" />
            </div>
            <ul>{list}</ul>
        </div>
    );
};

CompatibilityCheck.propTypes = {
    children: PropTypes.node
};

export default CompatibilityCheck;
