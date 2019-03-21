import React from 'react';
import { c } from 'ttag';
import { Select, useApiWithoutResult, useMailSettings, useEventManager } from 'react-components';
import { updateShowMoved } from 'proton-shared/lib/api/mailSettings';

const ShowMovedSelect = () => {
    const [{ ShowMoved }] = useMailSettings();
    const { call } = useEventManager();
    const { request, loading } = useApiWithoutResult(updateShowMoved);

    const handleChange = ({ target }) => async () => {
        await request(target.value);
        call();
    };

    const options = [{ text: c('Option').t`Include Moved`, value: 3 }, { text: c('Option').t`Hide Moved`, value: 0 }];

    return <Select value={ShowMoved} options={options} disabled={loading} onChange={handleChange} />;
};

export default ShowMovedSelect;
