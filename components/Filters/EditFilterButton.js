import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { Button, useModals } from 'react-components';
import { noop } from 'proton-shared/lib/helpers/function';
import { updateFilter } from 'proton-shared/lib/api/filters';

import AddFilterModal from '../../containers/Filters/AddFilterModal';

function EditFilterButton({ filter, type, className, onEditFilter, textContent }) {
    const { createModal } = useModals();

    const handelClick = () =>
        createModal(<AddFilterModal mode="update" filter={filter} type={type} onEdit={onEditFilter} />);

    return (
        <>
            <Button className={className} onClick={handelClick}>
                {textContent}
            </Button>
        </>
    );
}

EditFilterButton.propTypes = {
    filter: PropTypes.object.isRequired,
    className: PropTypes.string,
    onEditFilter: PropTypes.func
};

EditFilterButton.defaultProps = {
    onEditFilter: noop
};

export default EditFilterButton;
