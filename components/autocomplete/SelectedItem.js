import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../icon/Icon';

const SelectedItem = ({ item, onRemove }) => {
    const statusClasses = item.invalid ? 'autocomplete-selectedItem-invalid' : '';
    return (
        <div className={`mr0-5 pr0-5 pl0-5 flex autocomplete-selectedItem ${statusClasses}`}>
            {item.label}
            <button type="button" className="flex ml0-5 autocomplete-selectedItem-closeButton" onClick={onRemove}>
                <Icon name="close" />
            </button>
        </div>
    );
};

SelectedItem.propTypes = {
    onRemove: PropTypes.func,
    item: PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.any,
        invalid: PropTypes.bool
    })
};

export default SelectedItem;
