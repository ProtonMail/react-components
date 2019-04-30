import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../icon/Icon';

const SelectedItem = ({ label, isInvalid, onRemove }) => {
    const statusClasses = isInvalid ? 'autocomplete-selectedItem-invalid' : '';
    return (
        <div className={`mr0-5 pr0-5 pl0-5 flex autocomplete-selectedItem ${statusClasses}`}>
            {label}
            <button type="button" className="flex ml0-5 autocomplete-selectedItem-closeButton" onClick={onRemove}>
                <Icon name="close" />
            </button>
        </div>
    );
};

SelectedItem.propTypes = {
    isInvalid: PropTypes.bool,
    label: PropTypes.node,
    onRemove: PropTypes.func
};

export default SelectedItem;
