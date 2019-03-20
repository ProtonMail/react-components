import React from 'react';
import PropTypes from 'prop-types';

import Href from './href';
import Icon from '../icon';
import Tooltip from '../tooltip';

const wrapTooltip = (children, title) => <Tooltip title={title}>{children}</Tooltip>;
const wrapLink = (children, url) => <Href url={url}>{children}</Href>;

const Info = ({ url, title }) => {
    let children = <Icon name="info" />;

    if (url) {
        children = wrapLink(children, url);
    }

    if (title) {
        children = wrapTooltip(children, title);
    }

    return children;
};

Info.propTypes = {
    url: PropTypes.string,
    title: PropTypes.string
};

export default Info;
