import React from 'react';
import { c } from 'ttag';

import { deleteMailImportReport } from 'proton-shared/lib/api/mailImport';

import { ConfirmModal, Button, Alert } from '../../components';
import { useApi, useLoading, useNotifications, useEventManager, useModals } from '../../hooks';

interface Props {
    ID: string;
}

const PastImportDeleteButton = ({ ID }: Props) => {
    const api = useApi();
    const { call } = useEventManager();
    const { createModal } = useModals();

    const [loadingActions, withLoadingActions] = useLoading();
    const { createNotification } = useNotifications();

    const handleDelete = async () => {
        await new Promise<void>((resolve, reject) => {
            createModal(
                <ConfirmModal
                    onConfirm={resolve}
                    onClose={reject}
                    title={c('Confirm modal title').t`Remove from the list?`}
                    cancel={c('Action').t`Keep`}
                    confirm={<Button color="danger" type="submit">{c('Action').t`Remove`}</Button>}
                >
                    <Alert type="error">
                        {c('Warning').t`You will not see this import record in the list anymore.`}
                    </Alert>
                </ConfirmModal>
            );
        });
        await api(deleteMailImportReport(ID));
        await call();
        createNotification({ text: c('Success').t`Import record deleted` });
    };

    return (
        <Button
            size="small"
            shape="outline"
            onClick={() => withLoadingActions(handleDelete())}
            loading={loadingActions}
        >
            {c('Action').t`Delete record`}
        </Button>
    );
};

export default PastImportDeleteButton;
