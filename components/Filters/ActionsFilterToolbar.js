import React, { useState } from 'react';
import { c } from 'ttag';
import {
    Button,
    PrimaryButton,
    useModal,
    useEventManager,
    useNotifications,
    useApiWithoutResult
} from 'react-components';
import { addTreeFilter } from 'proton-shared/lib/api/filters';

import AddFilterModal from '../../containers/Filters/AddFilterModal';

function ActionsFilterToolbar() {
    const [type, setType] = useState('');
    const { isOpen, open, close } = useModal();

    const { call } = useEventManager();
    const { createNotification } = useNotifications();
    const { loading, request } = useApiWithoutResult(addTreeFilter);

    const handleClose = close;
    const handleSubmit = async (filter) => {
        const { Filter } = await request(filter);
        call();
        createNotification({
            text: c('Notification').t`${Filter.Name} created`
        });
        close();
    };

    const handleClickAdd = (type) => () => {
        setType(type);
        open();
    };

    return (
        <>
            <PrimaryButton onClick={handleClickAdd()}>{c('Action').t('Add Filter')}</PrimaryButton>
            <Button onClick={handleClickAdd('complex')} className="ml1">
                {c('Action').t('Add Sieve Filter')}
            </Button>
            {isOpen ? (
                <AddFilterModal
                    show={isOpen}
                    type={type}
                    loading={loading}
                    onClose={handleClose}
                    onSubmit={handleSubmit}
                />
            ) : null}
        </>
    );
}

export default ActionsFilterToolbar;
