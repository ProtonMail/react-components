import React from 'react';
import PropTypes from 'prop-types';

import Notification from './Notification';

const NotificationsContainer = ({ notifications, removeNotification, hideNotification }) => {
    const list = notifications.map(({ id, type, text, isClosing, disableAutoClose }) => {
        return (
            <Notification
                key={id}
                isClosing={isClosing}
                type={type}
                onClick={disableAutoClose ? undefined : () => hideNotification(id)}
                onExit={() => removeNotification(id)}
            >
                {text}
            </Notification>
        );
    });

    return <div className="notifications-container flex flex-column flex-items-center" data-cy="notifications-container">{list}</div>;
};

NotificationsContainer.propTypes = {
    notifications: PropTypes.arrayOf(PropTypes.object).isRequired,
    removeNotification: PropTypes.func.isRequired,
    hideNotification: PropTypes.func.isRequired
};

export default NotificationsContainer;
