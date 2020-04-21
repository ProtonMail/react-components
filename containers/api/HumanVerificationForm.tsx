import React, { useState } from 'react';
import { c } from 'ttag';
import { Alert, classnames, ButtonGroup, Group } from 'react-components';

import Captcha from './Captcha';
import CodeVerification from './CodeVerification';
import RequestInvite from './RequestInvite';

type MethodType = 'captcha' | 'payment' | 'sms' | 'email' | 'invite';

interface Props {
    onSubmit: (token: string, tokenType: string) => void;
    token: string;
    methods: MethodType[];
}

const PREFERED_ORDER = {
    captcha: 0,
    email: 1,
    sms: 2,
    invite: 3,
    payment: 4,
};

const orderMethods = (methods: MethodType[]): string[] => {
    const mapped = methods.map((item: MethodType, index: number) => ({ index, item }));
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

const getLabel = (method: MethodType): string =>
    ({
        captcha: c('Human verification method').t`CAPTCHA`,
        payment: c('Human verification method').t`Donation`,
        sms: c('Human verification method').t`SMS`,
        email: c('Human verification method').t`Email`,
        invite: c('Human verification method').t`Manual verification`
    }[method]);

const HumanVerificationForm = ({ methods, token, onSubmit }: Props) => {
    const orderedMethods = orderMethods(methods).filter((m: string): m is MethodType =>
        ['captcha', 'sms', 'email', 'invite'].includes(m)
    );

    const [method, setMethod] = useState<MethodType>(orderedMethods[0]);

    return (
        <>
            <Alert type="warning">{c('Info').t`For security reasons, please verify that you are not a robot.`}</Alert>
            {orderedMethods.length ? (
                <Group className="mb1">
                    {orderedMethods.map((m) => {
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
