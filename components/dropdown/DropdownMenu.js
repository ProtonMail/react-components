import React from 'react';
import PropTypes from 'prop-types';
import DropdownItem from './DropdownItem';

const DropdownMenu = ({ list }) => {
    return (
        <ul className="unstyled m0-5">
            {list.map((item, index) => (
                <DropdownItem {...item} key={item.text + index} />
            ))}
        </ul>
    );
};

DropdownMenu.propTypes = {
    list: PropTypes.arrayOf(PropTypes.object)
};

DropdownMenu.defaultProps = {
    list: []
};

export default DropdownMenu;
