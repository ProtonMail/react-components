import React, { useEffect, useState, useRef } from 'react';
import { useApi, Loader } from 'react-components';
import humanSize from 'proton-shared/lib/helpers/humanSize';
import { getMailImport } from 'proton-shared/lib/api/mailImport';

import { MailboxSize } from './interfaces';

interface Props {
    ID: string;
}

const getTotal = (mailboSize: MailboxSize) => Object.entries(mailboSize).reduce((acc, [, size]) => acc + size, 0);

const ImportSize = ({ ID }: Props) => {
    const api = useApi();
    const [total, setTotal] = useState(0);
    const intervalIDRef = useRef<NodeJS.Timeout>();

    const fetch = async () => {
        const { Import = {} } = await api(getMailImport(ID)); // TODO if UserSpaceLeft > MailboxSize stop fetching
        const { MailboxSize, UserSpaceLeft } = Import;

        if (MailboxSize) {
            const totalSize = getTotal(MailboxSize);
            setTotal(totalSize);
            UserSpaceLeft > totalSize && intervalIDRef.current && clearInterval(intervalIDRef.current);
        }
    };

    useEffect(() => {
        fetch();

        intervalIDRef.current = setInterval(() => {
            fetch();
        }, 10 * 1000);

        return () => {
            intervalIDRef.current && clearInterval(intervalIDRef.current);
        };
    }, []);

    if (!total) {
        return <Loader />;
    }

    return <>`${humanSize(total)} data for import size`</>;
};

export default ImportSize;
