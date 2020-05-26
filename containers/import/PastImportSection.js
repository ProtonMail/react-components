import React, { useState, useEffect } from 'react';
import { SubTitle, Alert, Loader, Table, TableHeader, TableBody, TableRow, useApi, useLoading } from 'react-components';
import { c } from 'ttag';
import { queryMailImportCurrent } from 'proton-shared/lib/api/mailImport';

const PastImportsSection = () => {
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
                <SubTitle>{c('Title').t`Import history`}</SubTitle>
                <Loader />
            </>
        );
    }

    if (!imports.length) {
        return (
            <>
                <SubTitle>{c('Title').t`Import history`}</SubTitle>
                <Alert>{c('Info').t`No past imports found`}</Alert>
            </>
        );
    }

    return (
        <>
            <SubTitle>{c('Title').t`Import history`}</SubTitle>
            <Table>
                <TableHeader
                    cells={[c('Title header').t`Import`, c('Title header').t`Status`, c('Title header').t`Actions`]}
                />
                <TableBody>
                    {imports.map(({ Email }, index) => {
                        return <TableRow key={index} cells={[Email, 'TODO', 'TODO']} />;
                    })}
                </TableBody>
            </Table>
        </>
    );
};

export default PastImportsSection;
