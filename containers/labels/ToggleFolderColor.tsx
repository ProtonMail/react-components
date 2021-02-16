import React, { ChangeEvent } from 'react';
import { c } from 'ttag';

import { Toggle } from '../../components';
import { useApi, useLoading, useEventManager, useNotifications } from '../../hooks';

interface Props {
    id?: string;
}

const ToggleFolderColor = ({ id }: Props) => {
    const api = useApi();
    const { call } = useEventManager();
    const { createNotification } = useNotifications();
    const [loading, withLoading] = useLoading();

    const handleChange = async ({ target }: ChangeEvent<HTMLInputElement>) => {
        await api({ TODO: +target.checked });
        await call();
        createNotification({
            text: c('label/folder notification').t`Preference updated`,
        });
    };

    return <Toggle id={id} onChange={(e) => withLoading(handleChange(e))} loading={loading} />;
};

export default ToggleFolderColor;
