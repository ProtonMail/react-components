import React, { ChangeEvent } from 'react';
import { c } from 'ttag';

import { Toggle } from '../../components';
import { useApi, useLoading, useEventManager, useNotifications, useMailSettings } from '../../hooks';

interface Props {
    id?: string;
    className?: string;
}

const ToggleInheritParentFolderColor = ({ id, className }: Props) => {
    const api = useApi();
    const { call } = useEventManager();
    const { createNotification } = useNotifications();
    const [loading, withLoading] = useLoading();
    const [mailSettings] = useMailSettings();

    const handleChange = async ({ target }: ChangeEvent<HTMLInputElement>) => {
        await api({ FolderColor: +target.checked });
        await call();
        createNotification({
            text: c('label/folder notification').t`Preference updated`,
        });
    };

    return (
        <Toggle
            id={id}
            checked={!!mailSettings?.AlsoArchive}
            className={className}
            onChange={(e) => withLoading(handleChange(e))}
            loading={loading}
        />
    );
};

export default ToggleInheritParentFolderColor;
