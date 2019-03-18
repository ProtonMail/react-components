import React from 'react';
import { c } from 'ttag';
import { Select, useApiWithoutResult, useMailSettings, useEventManager } from 'react-components';
import { updateDraftType } from 'proton-shared/lib/api/mailSettings';

const DraftTypeSelect = () => {
    const { DraftMIMEType } = useMailSettings();
    const { call } = useEventManager();
    const { request, loading } = useApiWithoutResult(updateDraftType);

    const handleChange = ({ target }) => async () => {
        await request(target.value);
        call();
    };

    const options = [
        { text: c('Option').t`Normal`, value: 'text/html' },
        { text: c('Option').t`Plain Text`, value: 'text/plain' }
    ];

    return <Select value={DraftMIMEType} options={options} disabled={loading} onChange={handleChange} />;
};

export default DraftTypeSelect;
