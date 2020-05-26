import React, { useEffect, useState } from 'react';
import { SubTitle, Alert, Table, TableHeader, TableBody, TableRow, Loader, useApi, useLoading } from 'react-components';
import { c } from 'ttag';
import { queryMailImportCurrent } from 'proton-shared/lib/api/mailImport';

const CurrentImportsSection = () => {
    const api = useApi();
    const [imports, setImports] = useState([]);
    const [loading, withLoading] = useLoading();

    const fetch = async () => {
        const { Imports = [] } = await api(queryMailImportCurrent());
        setImports(Imports);
    };

    useEffect(() => {
        withLoading(fetch());
    }, []);

    if (loading) {
        return (
            <>
                <SubTitle>{c('Title').t`Current imports`}</SubTitle>
                <Loader />
            </>
        );
    }

    if (!imports.length) {
        return (
            <>
                <SubTitle>{c('Title').t`Current imports`}</SubTitle>
                <Alert>{c('Info').t`No ongoing import`}</Alert>
            </>
        );
    }

    return (
        <>
            <SubTitle>{c('Title').t`Current imports`}</SubTitle>
            <Table>
                <TableHeader
                    cells={[
                        c('Title header').t`Import`,
                        c('Title header').t`Started`,
                        c('Title header').t`Progress`,
                        c('Title header').t`Actions`
                    ]}
                />
                <TableBody>
                    {imports.map(({ Email }, index) => {
                        return <TableRow key={index} cells={[Email, 'TODO', 'TODO', 'TODO']} />;
                    })}
                </TableBody>
            </Table>
        </>
    );
};

export default CurrentImportsSection;
