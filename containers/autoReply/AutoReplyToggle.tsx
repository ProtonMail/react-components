import * as React from 'react';
import { useState } from 'react';
import { updateAutoresponder } from 'proton-shared/lib/api/mailSettings';
import useToggle from '../../components/toggle/useToggle';
import useEventManager from '../eventManager/useEventManager';
import useApiWithoutResult from '../../hooks/useApiWithoutResult';
import Toggle from '../../components/toggle/Toggle';
import { AutoReplyDuration } from 'proton-shared/lib/constants';

interface Autoresponder {
    StartTime: number;
    Endtime: number;
    Repeat: AutoReplyDuration;
    DaysSelected: number[];
    Subject: string;
    Message: string;
    IsEnabled: boolean;
    Zone: string;
}

interface Props {
    autoresponder: Autoresponder;
}

const AutoReplyToggle = ({ autoresponder, ...rest }: Props) => {
    const { state, toggle } = useToggle(!!autoresponder.IsEnabled);
    const { call } = useEventManager();
    const { request } = useApiWithoutResult(updateAutoresponder);
    const [loading, setLoading] = useState(false);

    const handleToggle = async ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setLoading(true);
            await request({ ...autoresponder, IsEnabled: target.checked });
            await call();
            setLoading(false);
            toggle();
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    return <Toggle {...rest} loading={loading} checked={state} onChange={handleToggle} />;
};

export default AutoReplyToggle;
