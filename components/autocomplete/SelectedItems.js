import React from 'react';
import PropTypes from 'prop-types';

const SelectedItems = ({ selected, onRemove }) => {
    const handleRemove = (removed) => onRemove(removed, selected.filter((item) => item !== removed));

    return (
        <>
            {selected.map((item, i) => (
                <div key={i} className="mr0-5 autocomplete-selectedItem" onClick={() => handleRemove(item)}>
                    {item.label}
                </div>
            ))}
        </>
    );
};

SelectedItems.propTypes = {
    selected: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.any
        })
    ),
    onRemove: PropTypes.func
};

export default SelectedItems;
