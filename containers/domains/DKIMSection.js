import React from 'react';
import { c } from 'ttag';
import PropTypes from 'prop-types';
import { Alert, Table, TableHeader, TableBody, TableRow, Copy, Badge, Button, Time, useModals } from 'react-components';
import { DKIM_RSA_1024, DKIM_RSA_2048, DKIM_KEY_STATUS } from 'proton-shared/lib/constants';

import GenerateKeyModal from './GenerateKeyModal';

const ALGO = {
    [DKIM_RSA_1024]: 'RSA 1024',
    [DKIM_RSA_2048]: 'RSA 2048'
};

const KEY_STATUS = {
    [DKIM_KEY_STATUS.ACTIVE]: (
        <Badge
            className=""
            tooltip={c('Description').t`Key is active and can be used for signing emails`}
            type="success"
        >{c('Status').t`Active`}</Badge>
    ),
    [DKIM_KEY_STATUS.PENDING]: (
        <Badge
            className=""
            tooltip={c('Description').t`Key is waiting to be activated once DNS state becomes good`}
            type="warning"
        >{c('Status').t`Pending`}</Badge>
    ),
    [DKIM_KEY_STATUS.RETIRED]: (
        <Badge
            className=""
            tooltip={c('Description').t`Key is no longer used for signing and is waiting to be deceased`}
            type="origin"
        >{c('Status').t`Retired`}</Badge>
    ),
    [DKIM_KEY_STATUS.DECEASED]: (
        <Badge
            className=""
            tooltip={c('Description').t`Once new pending key is generated this key will be removed`}
            type="origin"
        >{c('Status').t`Deceased`}</Badge>
    )
};

const DKIMSection = ({ domain }) => {
    const off = <code key="off">off</code>;
    const { createModal } = useModals();
    const openGenerateKeyModal = () => createModal(<GenerateKeyModal domain={domain} />);

    return (
        <>
            <Alert learnMore="https://protonmail.com/support/knowledge-base/anti-spoofing/">
                {c('Info')
                    .t`ProtonMail supports DKIM signing for custom domains! To use DKIM authentication, please add the following TXT record into your DNS for this domain. This can typically be done in the control panel of your domain name registrar.`}
            </Alert>
            <p className="mb1 bl">{c('Label')
                .t`Please add the following TXT record. Note, DNS records can take several hours to update.`}</p>
            {domain.Keys.map(({ PublicKey, Algorithm, Selector, CreateTime, State }, index) => {
                const value = `v=DKIM1;k=rsa;p=${State === DKIM_KEY_STATUS.RETIRED ? '' : `${PublicKey};`}`;
                return (
                    <React.Fragment key={index}>
                        <div className="flex flex-spacebetween flex-items-center flex-nowrap">
                            <div className="flex flex-nowrap flex-items-center">
                                <label className="bold mr0-5">{c('Label').t`Key:`}</label>
                                <span className="mr1">{ALGO[Algorithm]}</span>
                                {State === DKIM_KEY_STATUS.ACTIVE ? (
                                    <>
                                        <label className="bold mr0-5">{c('Label').t`Active since:`}</label>
                                        <Time>{CreateTime}</Time>
                                    </>
                                ) : null}
                            </div>
                            {KEY_STATUS[State]}
                        </div>
                        <Table>
                            <TableHeader
                                cells={[
                                    c('Header for domain modal').t`Type`,
                                    c('Header for domain modal').t`Host name`,
                                    c('Header for domain modal').t`Value`
                                ]}
                            />
                            <TableBody>
                                <TableRow
                                    cells={[
                                        <code key="txt">TXT</code>,
                                        <code key="domain-key">{`${Selector}._domainkey`}</code>,
                                        <div className="flex flex-nowrap flex-items-center" key="value">
                                            <Copy className="flex-item-noshrink pm-button--small mr0-5" value={value} />{' '}
                                            <code>{value}</code>
                                        </div>
                                    ]}
                                />
                            </TableBody>
                        </Table>
                    </React.Fragment>
                );
            })}
            <Button className="mb1" onClick={openGenerateKeyModal}>{c('Action').t`Generate a new key`}</Button>
            <Alert type="warning">{c('Info')
                .jt`Keep this record in your DNS for as long as you want to use DKIM. You can change its Value to ${off} to disable DKIM.`}</Alert>
        </>
    );
};

DKIMSection.propTypes = {
    domain: PropTypes.object.isRequired
};

export default DKIMSection;
