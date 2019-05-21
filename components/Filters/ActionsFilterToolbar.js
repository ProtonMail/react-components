import React from 'react';
import { c } from 'ttag';
import { Button, PrimaryButton, useModals } from 'react-components';

import AddFilterModal from '../../containers/Filters/AddFilterModal';

function ActionsFilterToolbar() {
    const { createModal } = useModals();

    const handleClickAdd = (type) => () => {
        createModal(<AddFilterModal type={type} />);
    };

    return (
        <>
            <PrimaryButton onClick={handleClickAdd()}>{c('Action').t`Add Filter`}</PrimaryButton>
            <Button onClick={handleClickAdd('complex')} className="ml1">
                {c('Action').t`Add Sieve Filter`}
            </Button>
        </>
    );
}

export default ActionsFilterToolbar;
