import React from 'react';
import PropTypes from 'prop-types';
import { classnames } from '../../helpers/component';

const IllustrationPlaceholder = ({ className, title, text, url, urlDarkVersion = '', uppercase, children }) => {
    const info = typeof text === 'string' ? <p>{text}</p> : text;
    const darkImg = urlDarkVersion !== '' ? <img src={urlDarkVersion} alt={title} className="p1 mb1 display-on-darkmode" /> : null;

    return (
        <div className={classnames(['flex flex-column flex-items-center w100', className])}>
            <img src={url} alt={title} className={classnames(['p1 mb1', darkImg && 'hide-on-darkmode'])} />
            {darkImg}
            <h2 className={classnames(['bold', uppercase && 'uppercase'])}>{title}</h2>
            {info}
            {children}
        </div>
    );
};

IllustrationPlaceholder.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string.isRequired,
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    url: PropTypes.string.isRequired,
    urlDarkVersion: PropTypes.string,
    uppercase: PropTypes.bool,
    children: PropTypes.node
};

export default IllustrationPlaceholder;
