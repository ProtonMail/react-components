import React from 'react';
import { c } from 'ttag';
import { Select, useApiWithoutResult, useMailSettings, useEventManager } from 'react-components';
import { updateRightToLeft } from 'proton-shared/lib/api/mailSettings';

const TextDirectionSelect = () => {
    const [{ RightToLeft }] = useMailSettings();
    const { call } = useEventManager();
    const { request, loading } = useApiWithoutResult(updateRightToLeft);

    const handleChange = ({ target }) => async () => {
        await request(target.value);
        call();
    };

    const options = [
        { text: c('Option').t`Left to Right`, value: 0 },
        { text: c('Option').t`Right to Left`, value: 1 }
    ];

    return <Select value={RightToLeft} options={options} disabled={loading} onChange={handleChange} />;
};

export default TextDirectionSelect;
