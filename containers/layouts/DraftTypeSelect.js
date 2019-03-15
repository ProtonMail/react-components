import React from 'react';
import { c } from 'ttag';
import { Select, useApiWithoutResult, useEventManager } from 'react-components';
import { updateDraftType } from 'proton-shared/lib/api/mailSettings';

// const { NORMAL, PLAIN_TEXT } = DRAFT_TYPE;

const DraftTypeSelect = () => {
    // const { DraftMIMEType } = useMailSettings();
    const { call } = useEventManager();
    const { request, loading } = useApiWithoutResult(updateDraftType);

    const handleChange = (event) => async () => {
        await request(event.target.value);
        call();
    };

    // const api = useApi();
    // const handleChange = (event) => api(updateDraftType(event.target.value));

    const options = [
        { text: c('Option').t`Normal`, value: 'text/html' },
        { text: c('Option').t`Plain Text`, value: 'text/plain' }
    ];

    return (
        <>
            <Select options={options} diabled={loading} onChange={handleChange} />
        </>
    );

    // return <Select options={options} onChange={handleChange} />;
};

export default DraftTypeSelect;
