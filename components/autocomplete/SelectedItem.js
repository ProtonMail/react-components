import React from 'react';
import PropTypes from 'prop-types';

const SelectedItem = ({ item, onRemove }) => (
    <div className="mr0-5 autocomplete-selectedItem" onClick={onRemove}>
        {item.label}
    </div>
);

SelectedItem.propTypes = {
    onRemove: PropTypes.func,
    item: PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.any
    })
};

export default SelectedItem;
