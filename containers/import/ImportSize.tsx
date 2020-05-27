import React, { useEffect, useState } from 'react';
import { useApi, Loader } from 'react-components';
import humanSize from 'proton-shared/lib/helpers/humanSize';
import { getMailImport } from 'proton-shared/lib/api/mailImport';

import { MailboxSize } from './interfaces';

interface Props {
    ID: string;
}

const ImportSize = ({ ID }: Props) => {
    const api = useApi();
    const [mailboSize, setMailboxSize] = useState<undefined | MailboxSize>();

    const fetch = async () => {
        const { MailboxSize } = await api(getMailImport(ID)); // TODO if UserSpaceLeft > MailboxSize stop fetching
        setMailboxSize(MailboxSize);
    };

    useEffect(() => {
        fetch();

        const intervalID = setInterval(() => {
            fetch();
        }, 10 * 1000);

        return () => {
            clearInterval(intervalID);
        };
    }, []);

    if (!mailboSize) {
        return <Loader />;
    }

    const total = Object.entries(mailboSize).reduce((acc, [, size]) => acc + size, 0);

    return <>`${humanSize(total)} data for import size`</>;
};

export default ImportSize;
