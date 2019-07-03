import React from 'react';
import { c } from 'ttag';
import {
    PrimaryButton,
    AskPasswordModal,
    useOrganization,
    useNotifications,
    useApi,
    useModals
} from 'react-components';
import { srpAuth } from 'proton-shared/lib/srp';
import { unlockPasswordChanges } from 'proton-shared/lib/api/user';

import SetupOrganizationModal from './SetupOrganizationModal';

const ActivateOrganizationButton = () => {
    const [{ MaxMembers }] = useOrganization();
    const { createNotification } = useNotifications();
    const { createModal } = useModals();
    const api = useApi();

    const handleClick = async () => {
        if (MaxMembers === 1) {
            return createNotification({
                type: 'info',
                text: c('Info')
                    .t`Please upgrade to a Professional plan with more than 1 user, or a Visionary account, to get multi-user support.`
            });
        }

        const { password, totp } = await new Promise((resolve, reject) => {
            createModal(<AskPasswordModal onClose={reject} onSubmit={resolve} />);
        });

        await srpAuth({
            api,
            credentials: { password, totp },
            config: unlockPasswordChanges()
        });

        createModal(<SetupOrganizationModal />);
    };
    return <PrimaryButton onClick={handleClick}>{c('Action').t`Enable multi-user support`}</PrimaryButton>;
};

export default ActivateOrganizationButton;
