import React from 'react';
import { c } from 'ttag';
import { RadioCard, useApiWithoutResult, useMailSettings, useEventManager } from 'react-components';
import { updateViewMode } from 'proton-shared/lib/api/mailSettings';
import { VIEW_MODE } from 'proton-shared/lib/constants';

const { GROUP, SINGLE } = VIEW_MODE;

const ViewModeRadios = () => {
    const { ViewMode } = useMailSettings();
    const { call } = useEventManager();
    const { request, loading } = useApiWithoutResult(updateViewMode);

    const handleChange = (mode) => async () => {
        await request(mode);
        call();
    };

    return (
        <>
            <RadioCard
                value={GROUP}
                checked={ViewMode === GROUP}
                id="groupRadio"
                disabled={loading}
                name="viewMode"
                label={c('Label to change view mode').t`Conversation group`}
                onChange={handleChange(GROUP)}
            >
                <img alt="Group" src="todo" />
            </RadioCard>
            <RadioCard
                value={SINGLE}
                checked={ViewMode === SINGLE}
                id="singleRadio"
                disabled={loading}
                name="ViewMode"
                label={c('Label to change view mode').t`Single messages`}
                onChange={handleChange(SINGLE)}
            >
                <img alt="Single" src="todo" />
            </RadioCard>
        </>
    );
};

export default ViewModeRadios;
