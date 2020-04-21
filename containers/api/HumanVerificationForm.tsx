import React, { useState, useEffect } from 'react';
import { c } from 'ttag';
import { Alert, classnames, ButtonGroup, Group } from 'react-components';

import Captcha from './Captcha';
import CodeVerification from './CodeVerification';
import RequestInvite from './RequestInvite';

interface Props {
    onSubmit: (token: string, tokenType: string) => void;
    token: string;
    methods: string[];
}

const PREFERED_ORDER = {
    captcha: 0,
    email: 1,
    sms: 2,
    invite: 3
};

const orderMethods = (methods: string[]): string[] => {
    const mapped = methods.map((item: string, index: number) => ({ index, item }));
    mapped.sort((a, b) => {
        if (PREFERED_ORDER[a.item] > PREFERED_ORDER[b.item]) {
            return 1;
        }
        if (PREFERED_ORDER[a.item] < PREFERED_ORDER[b.item]) {
            return -1;
        }
        return 0;
    });
    return mapped.map(({ index }) => methods[index]);
};

const getLabel = (method: string): string =>
    ({
        captcha: c('Human verification method').t`CAPTCHA`,
        payment: c('Human verification method').t`Donation`,
        sms: c('Human verification method').t`SMS`,
        email: c('Human verification method').t`Email`,
        invite: c('Human verification method').t`Manual verification`
    }[method]);

const HumanVerificationForm = ({ methods, token, onSubmit }: Props) => {
    const [method, setMethod] = useState<string>('');

    const orderedMethods = orderMethods(methods).filter((m: string) =>
        ['captcha', 'sms', 'email', 'invite'].includes(m)
    );

    useEffect(() => {
        if (orderedMethods.length) {
            setMethod(orderedMethods[0]);
        }
    }, []);

    return (
        <>
            <Alert type="warning">{c('Info').t`For security reasons, please verify that you are not a robot.`}</Alert>
            {orderedMethods.length ? (
                <Group className="mb1">
                    {orderedMethods.map((m: string) => {
                        const isActive = method === m;
                        return (
                            <ButtonGroup
                                key={m}
                                onClick={() => setMethod(m)}
                                className={classnames([isActive && 'is-active'])}
                            >
                                {getLabel(m)}
                            </ButtonGroup>
                        );
                    })}
                </Group>
            ) : null}
            {method === 'captcha' ? <Captcha token={token} onSubmit={(token) => onSubmit(token, method)} /> : null}
            {method === 'email' ? <CodeVerification onSubmit={(token) => onSubmit(token, method)} method="email" /> : null}
            {method === 'sms' ? <CodeVerification onSubmit={(token) => onSubmit(token, method)} method="sms" /> : null}
            {method === 'invite' ? <RequestInvite /> : null}
        </>
    );
};

export default HumanVerificationForm;
