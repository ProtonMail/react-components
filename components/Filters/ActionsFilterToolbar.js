import React, { useState } from 'react';
import { c } from 'ttag';
import { Button, PrimaryButton, useModals } from 'react-components';

import AddFilterModal from '../../containers/Filters/AddFilterModal';

function ActionsFilterToolbar() {
    const [type, setType] = useState('');
    const { createModal } = useModals();

    const handleClickAdd = (type) => () => {
        setType(type);
        createModal(<AddFilterModal type={type} />);
    };

    return (
        <>
            <PrimaryButton onClick={handleClickAdd()}>{c('Action').t('Add Filter')}</PrimaryButton>
            <Button onClick={handleClickAdd('complex')} className="ml1">
                {c('Action').t('Add Sieve Filter')}
            </Button>
        </>
    );
}

export default ActionsFilterToolbar;
