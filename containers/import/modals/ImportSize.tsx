import React, { useEffect, useState /* , useRef */ } from 'react';
import { c } from 'ttag';
import { useApi /* Loader */ } from '../../..';
import humanSize from 'proton-shared/lib/helpers/humanSize';
import { getMailImport } from 'proton-shared/lib/api/mailImport';

import { MailboxSize } from '../interfaces';

interface Props {
    ID: string;
    Code: string;
}

const getTotal = (mailboSize: MailboxSize) => Object.entries(mailboSize).reduce((acc, [, size]) => acc + size, 0);

const ImportSize = ({ ID, Code }: Props) => {
    const api = useApi();
    const [total, setTotal] = useState(0);
    // const intervalIDRef = useRef<NodeJS.Timeout>();

    const fetch = async () => {
        const { Importer } = await api(getMailImport(ID, { Code })); // TODO if UserSpaceLeft > MailboxSize stop fetching
        const { MailboxSize /* , UserSpaceLeft */ } = Importer || {};

        if (MailboxSize) {
            const totalSize = getTotal(MailboxSize);
            setTotal(totalSize);
            // UserSpaceLeft > totalSize && intervalIDRef.current && clearInterval(intervalIDRef.current);
        }
    };

    useEffect(() => {
        fetch();

        // intervalIDRef.current = setInterval(() => {
        //    fetch();
        // }, 10 * 1000);

        // return () => {
        //     intervalIDRef.current && clearInterval(intervalIDRef.current);
        // };
    }, []);

    if (!total) {
        return null;
        // return <Loader />;
    }

    return <span>{c('Info').t`${humanSize(total)} data for import size`}</span>;
};

export default ImportSize;
