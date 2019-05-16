import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { Button, useModal, useEventManager, useNotifications, useApiWithoutResult } from 'react-components';
import { noop } from 'proton-shared/lib/helpers/function';
import { updateFilter } from 'proton-shared/lib/api/filters';

import AddFilterModal from '../../containers/Filters/AddFilterModal';

function EditFilterButton({ filter, mode, className, onEditFilter, textContent }) {
    const { call } = useEventManager();
    const { createNotification } = useNotifications();
    const { request } = useApiWithoutResult(updateFilter);
    const { isOpen, open, close } = useModal();

    const handelClick = open;
    const handleCloseModal = close;

    const handleSubmitModal = async (filter) => {
        const { Filter } = await request(filter.ID, filter);
        call();
        createNotification({
            text: c('Filter notification').t`Filter ${Filter.Name} updated`
        });
        close();
        onEditFilter(Filter);
    };

    return (
        <>
            <Button className={className} onClick={handelClick}>
                {textContent}
            </Button>
            {isOpen ? (
                <AddFilterModal
                    show={isOpen}
                    filter={filter}
                    type={mode}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmitModal}
                />
            ) : null}
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
