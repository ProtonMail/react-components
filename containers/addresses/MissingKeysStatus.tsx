import { c } from 'ttag';
import React from 'react';
import { Badge, LoaderIcon } from '../../index';

export enum STATUS {
    QUEUED,
    DONE,
    FAILURE,
    LOADING
}

interface Props {
    type: STATUS;
    tooltip?: string;
}
const Status = ({ type, tooltip }: Props) => {
    if (type === STATUS.QUEUED) {
        return <Badge type="default">{c('Info').t`Queued`}</Badge>;
    }

    if (type === STATUS.DONE) {
        return <Badge type="success">{c('Info').t`Done`}</Badge>;
    }

    if (type === STATUS.FAILURE) {
        return <Badge type="error" tooltip={tooltip}>{c('Error').t`Error`}</Badge>;
    }

    if (type === STATUS.LOADING) {
        return <LoaderIcon />;
    }
    return null;
};

export default Status;
