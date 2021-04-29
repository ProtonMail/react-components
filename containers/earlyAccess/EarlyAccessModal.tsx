import React from 'react';
import { c } from 'ttag';

import { Checkbox, FormModal, Label } from '../../components';
import useEarlyAccess from '../../hooks/useEarlyAccess';
import useSynchronizingState from '../../hooks/useSynchronizingState';

const EarlyAccessModal = (props: { onClose?: () => void }) => {
    const earlyAccess = useEarlyAccess();

    const [earlyAccessEnabled, setEarlyAccessEnabled] = useSynchronizingState(earlyAccess.value);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setEarlyAccessEnabled(e.target.checked);
    };

    const update = async () => {
        await earlyAccess.update(earlyAccessEnabled);
        window.location.reload();
    };

    return (
        <FormModal
            {...props}
            intermediate
            close={c('Action').t`Cancel`}
            submit={c('Action').t`Apply`}
            loading={earlyAccess.loading || !earlyAccess.canUpdate}
            onSubmit={update}
        >
            <div className="h2">{c('Title').t`Early access`}</div>
            <p>
                {c('Early access description')
                    .t`Early access gives you access to the beta version of Proton which has new features and improvements. Our beta versions undergo the same reliability testing as our public versions, but if you encounter any issues, you can switch off early access.`}
            </p>
            <div className="mb0-5">
                <Label>
                    <Checkbox checked={earlyAccessEnabled} onChange={handleChange} />{' '}
                    {c('Label').t`Enable early access`}
                </Label>
            </div>
            <p className="mb0-5 color-weak">
                {c('Refresh on apply warning').t`Note: upon applying a change, the application will be refreshed.`}
            </p>
        </FormModal>
    );
};

export default EarlyAccessModal;
