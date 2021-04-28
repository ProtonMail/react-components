import React, { useEffect, useState } from 'react';
import { c } from 'ttag';

import { Checkbox, FormModal, Label } from '../../components';
import useEarlyAccess from './useEarlyAccess';

const EarlyAccessModal = (props: { onClose?: () => void }) => {
    const earlyAccess = useEarlyAccess();

    const [earlyAccessEnabled, setEarlyAccessEnabled] = useState(earlyAccess.value);

    /*
     * In case value changes after this component has already mounted
     * (possible scenarios are request completion or event-manager update)
     * the initial value provided to earlyAccessEnabled is wrong. Let's
     * update if it differs as soon as we receive the updated value.
     */
    useEffect(() => {
        if (earlyAccess.value !== earlyAccessEnabled) {
            setEarlyAccessEnabled(earlyAccess.value);
        }
    }, [earlyAccess.value]);

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
            close={c('Action').t`Cancel`}
            submit={c('Action').t`Apply`}
            loading={earlyAccess.loading || !earlyAccess.canUpdate}
            onSubmit={update}
        >
            <div className="h1">{c('Title').t`Early access`}</div>
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
        </FormModal>
    );
};

export default EarlyAccessModal;
