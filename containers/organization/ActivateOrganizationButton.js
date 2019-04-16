import React from 'react';
import { c } from 'ttag';
import {
    PrimaryButton,
    AskPasswordModal,
    useOrganization,
    useNotifications,
    useApi,
    usePrompts,
    useModal
} from 'react-components';
import { srpAuth } from 'proton-shared/lib/srp';
import { unlockPasswordChanges } from 'proton-shared/lib/api/user';

import SetupOrganizationModal from './SetupOrganizationModal';

const ActivateOrganizationButton = () => {
    const [{ MaxMembers }] = useOrganization();
    const { createNotification } = useNotifications();
    const { createPrompt } = usePrompts();
    const { isOpen, open, close } = useModal();
    const api = useApi();

    const handleClick = async () => {
        if (MaxMembers === 1) {
            return createNotification({
                type: 'info',
                text: c('Info')
                    .t`Please upgrade to a Professional plan with more than 1 user, or a Visionary account, to get multi-user support.`
            });
        }

        const { password, totp } = await createPrompt((resolve, reject) => (
            <AskPasswordModal onClose={reject} onSubmit={resolve} />
        ));

        await srpAuth({
            api,
            credentials: { password, totp },
            config: unlockPasswordChanges()
        });

        open();
    };
    return (
        <>
            <PrimaryButton onClick={handleClick}>{c('Action').t`Enable multi-user support`}</PrimaryButton>
            <SetupOrganizationModal show={isOpen} onClose={close} />
        </>
    );
};

export default ActivateOrganizationButton;
