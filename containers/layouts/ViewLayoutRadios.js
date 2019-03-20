import React from 'react';
import { c } from 'ttag';
import { RadioCard, useApiWithoutResult, useMailSettings, useEventManager } from 'react-components';
import { updateViewLayout } from 'proton-shared/lib/api/mailSettings';
import { VIEW_LAYOUT } from 'proton-shared/lib/constants';
import inboxColumnSvg from 'design-system/assets/img/pm-images/inbox-colum.svg';
import inboxRowSvg from 'design-system/assets/img/pm-images/inbox-row.svg';

const { COLUMN, ROW } = VIEW_LAYOUT;

const ViewLayoutRadios = () => {
    const { ViewLayout } = useMailSettings();
    const { call } = useEventManager();
    const { request, loading } = useApiWithoutResult(updateViewLayout);

    const handleChange = (mode) => async () => {
        await request(mode);
        call();
    };

    return (
        <>
            <RadioCard
                value={COLUMN}
                checked={ViewLayout === COLUMN}
                id="columnRadio"
                disabled={loading}
                name="viewLayout"
                label={c('Label to change view layout').t`Column`}
                onChange={handleChange(COLUMN)}
            >
                <img alt="Column" src={inboxColumnSvg} />
            </RadioCard>
            <RadioCard
                value={ROW}
                checked={ViewLayout === ROW}
                id="rowRadio"
                disabled={loading}
                name="viewLayout"
                label={c('Label to change view layout').t`Row`}
                onChange={handleChange(ROW)}
            >
                <img alt="Row" src={inboxRowSvg} />
            </RadioCard>
        </>
    );
};

export default ViewLayoutRadios;
