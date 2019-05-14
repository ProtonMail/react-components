import React from 'react';
import { c } from 'ttag';
import PropTypes from 'prop-types';
import { Alert, Label, Table, TableHeader, TableBody, TableRow } from 'react-components';

const VerifySection = ({ domain }) => {
    return (
        <>
            <Alert learnMore="https://protonmail.com/support/knowledge-base/dns-records/">
                {c('Info for domain modal')
                    .t`For security reasons, we need to verify that you are the owner of your domain. Please add the following code into your DNS record.`}
            </Alert>
            <Alert type="warning">
                <strong>{c('Warning for domain modal').t`Do not remove it even after successful verification.`}</strong>
                <br />
                {c('Warning for domain modal')
                    .t`This can typically be done in the control panel of your domain name registrar.`}
            </Alert>
            <Label>{c('Label for domain modal').t`Please add the following TXT record:`}</Label>
            <Table>
                <TableHeader
                    cells={[
                        c('Header for domain modal').t`Type`,
                        c('Header for domain modal').t`Host name`,
                        c('Header for domain modal').t`Value / Data / Points to`
                    ]}
                />
                <TableBody>
                    <TableRow cells={['TXT', '@', domain.VerifyCode]} />
                </TableBody>
            </Table>
            <Alert type="warning">{c('Warning for domain modal')
                .t`It can take up to a day for DNS changes to update.`}</Alert>
        </>
    );
};

VerifySection.propTypes = {
    domain: PropTypes.object.isRequired
};

export default VerifySection;
