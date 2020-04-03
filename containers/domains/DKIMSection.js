import React from 'react';
import { c } from 'ttag';
import PropTypes from 'prop-types';
import { Alert, Table, TableBody, TableCell, Copy, useNotifications } from 'react-components';
import { DKIM_STATE } from 'proton-shared/lib/constants';

const DKIMSection = ({ domain }) => {
    const { createNotification } = useNotifications();
    const handleCopy = () => createNotification({ text: c('Success').t`Value copied to clipboard!` });
    const {
        DKIM: { Config },
        DkimState
    } = domain;

    return (
        <>
            <Alert learnMore="https://protonmail.com/support/knowledge-base/anti-spoofing/">
                {c('Info')
                    .t`ProtonMail supports DKIM signing for custom domains. To use DKIM authentication, please add the following TXT record into your DNS settings for this domain. This can typically be done in the control panel of your domain name registrar.`}
            </Alert>
            {DkimState === DKIM_STATE.DKIM_STATE_ERROR && (
                <Alert type="error">
                    {c('Error')
                        .t`We stopped DKIM signing due to problems with your DNS configuration. Please follow the instructions below to resume signing.`}
                </Alert>
            )}
            {DkimState === DKIM_STATE.DKIM_STATE_WARNING && (
                <Alert type="warning">
                    {c('Warning')
                        .t`We detected a problem with your DNS configuration. Please make sure your records match the instructions below. If the problem persists, we will have to switch DKIM signing off.`}
                </Alert>
            )}
            <p className="mb1 bl">
                {c('Label')
                    .t`Please add all 3 of the following CNAME records. Note, DNS records can take several hours to update.`}
            </p>
            <Table>
                <thead>
                    <tr>
                        <TableCell type="header" className="w15">
                            {c('Header for domain modal').t`Type`}
                        </TableCell>
                        <TableCell type="header">{c('Header for domain modal').t`Host name`}</TableCell>
                        <TableCell type="header" className="w50">
                            {c('Header for domain modal').t`Value / Data`}
                        </TableCell>
                    </tr>
                </thead>
                <TableBody>
                    {Config.map((row) => (
                        <tr key={row.Hostname}>
                            <TableCell key="cname">
                                <code>CNAME</code>
                            </TableCell>
                            <TableCell key="hostname">
                                <code>{row.Hostname}</code>
                            </TableCell>
                            <TableCell key="value">
                                <div className="flex flex-nowrap flex-items-center">
                                    <Copy
                                        onCopy={handleCopy}
                                        className="flex-item-noshrink pm-button--small mr0-5"
                                        value={row.CNAME}
                                    />{' '}
                                    <div className="ellipsis">
                                        <code title={row.CNAME}>{row.CNAME}</code>
                                    </div>
                                </div>
                            </TableCell>
                        </tr>
                    ))}
                </TableBody>
            </Table>
            <Alert type="warning">{c('Info')
                .t`Keep those records in your DNS for as long as you want to use DKIM.`}</Alert>
        </>
    );
};

DKIMSection.propTypes = {
    domain: PropTypes.object.isRequired
};

export default DKIMSection;
