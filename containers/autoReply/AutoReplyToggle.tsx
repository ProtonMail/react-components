import * as React from 'react';
import { useState } from 'react';
import { updateAutoresponder } from 'proton-shared/lib/api/mailSettings';
import useToggle from '../../components/toggle/useToggle';
import useEventManager from '../eventManager/useEventManager';
import useApiWithoutResult from '../../hooks/useApiWithoutResult';
import Toggle from '../../components/toggle/Toggle';

// TODO: move to shared interfaces

enum AutoresponderRepeat {
    FIXED,
    DAILY,
    WEEKLY,
    MONTHLY,
    PERMANENT
}

interface Autoresponder {
    StartTime: number;
    Endtime: number;
    Repeat: AutoresponderRepeat;
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
