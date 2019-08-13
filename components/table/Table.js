import React from 'react';
import PropTypes from 'prop-types';

const Table = ({ children = [], className = '', caption }) => {
    return (
        <table className={`pm-simple-table ${className}`}>
            {caption ? <caption className="sr-only">{caption}</caption> : null}
            {children}
        </table>
    );
};

Table.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    caption: PropTypes.string
};

export default Table;
