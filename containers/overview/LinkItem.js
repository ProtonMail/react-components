import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Icon } from 'react-components';
import { c } from 'ttag';

const href = (route) => `${route.pathname}#${route.hash}`;

const LinkItem = ({ route, text, permission, history }) => {
    const handleClick = async (event) => {
        event.preventDefault();

        history.push(href(route));

        // Let the router do the navigation
        await null;

        const el = document.querySelector(`#${route.hash}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <a onClick={handleClick} href={href(route)}>
            <span className="mr0-5">{text}</span>
            {permission ? null : (
                <Tooltip title={c('Tag').t`Premium feature`}>
                    <Icon name="starfull" fill="attention" />
                </Tooltip>
            )}
        </a>
    );
};

LinkItem.propTypes = {
    route: PropTypes.object,
    permission: PropTypes.bool,
    text: PropTypes.string,
    history: PropTypes.object.isRequired
};

export default LinkItem;
