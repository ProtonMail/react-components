import React from 'react';
import { c } from 'ttag';

import { Alert, ConfirmModal } from '../../components';

export type Environment = 'alpha' | 'beta' | 'prod';
interface Props {
    environment: Environment;
    onConfirm: () => void;
    onCancel: () => void;
}

const EarlyAccessSwitchModal = ({ environment, onCancel, onConfirm, ...rest }: Props) => {
    // translator: refers to early access programs, can be "Alpha" or "Beta"
    const title = c('Title').t`Opt into ${environment}`;

    return (
        <ConfirmModal small title={title} onClose={onCancel} onConfirm={onConfirm} {...rest}>
            <Alert>
                {c('Info')
                    .t`Please confirm you'd like to join the ${environment} Program and get access to the latest features available. The application will refresh.`}
            </Alert>
        </ConfirmModal>
    );
};

export default EarlyAccessSwitchModal;
