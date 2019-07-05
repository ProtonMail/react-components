import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { ApiContext, NotificationsProvider, LocaleNonAuthProvider } from 'react-components';

const UnAuthenticatedApp = ({ initApi, children }) => {
    const apiRef = useRef();
    const notificationsRef = useRef();

    if (!apiRef.current) {
        apiRef.current = initApi();
    }

    return (
        <NotificationsProvider ref={notificationsRef}>
            <ApiContext.Provider value={apiRef.current}>
                <LocaleNonAuthProvider>{children}</LocaleNonAuthProvider>
            </ApiContext.Provider>
        </NotificationsProvider>
    );
};

UnAuthenticatedApp.propTypes = {
    initApi: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
};

export default UnAuthenticatedApp;
