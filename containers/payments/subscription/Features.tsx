import React, { useState } from 'react';
import { c } from 'ttag';
import { PLANS } from 'proton-shared/lib/constants';

import { useActiveBreakpoint } from '../../../hooks';
import { MailFeature, VPNFeature, PlanLabel } from './interface';
import { PrimaryButton, Tabs } from '../../../components';

interface Props {
    planLabels: PlanLabel[];
    features: (MailFeature | VPNFeature)[];
    onSelect: (planName: PLANS | 'free') => void;
}

type UghRest = keyof Omit<MailFeature | VPNFeature, 'name' | 'label'>;

const Features = ({ onSelect, planLabels, features }: Props) => {
    const { isNarrow } = useActiveBreakpoint();
    const [tab, setTab] = useState(0);

    if (isNarrow) {
        return (
            <Tabs value={tab} onChange={setTab}>
                {planLabels.map(({ label, key }) => ({
                    title: label,
                    content: (
                        <React.Fragment key={key}>
                            <div className="mb1">
                                <PrimaryButton onClick={() => onSelect(key)}>{c('Action')
                                    .t`Select plan`}</PrimaryButton>
                            </div>
                            <table key={key} className="simple-table text-cut simple-table--alternate-bg-row w100">
                                <thead>
                                    <tr>
                                        <th scope="col">{c('Title').t`All features`}</th>
                                        <th scope="col">{label}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {features.map(({ name, label, ...rest }) => {
                                        return (
                                            <tr key={name}>
                                                <th scope="row">{label}</th>
                                                <td key={key}>{rest[key as UghRest]}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </React.Fragment>
                    ),
                }))}
            </Tabs>
        );
    }

    return (
        <table className="simple-table text-cut simple-table--alternate-bg-row w100">
            <thead>
                <tr>
                    <th scope="col">{c('Title').t`All features`}</th>
                    {planLabels.map(({ label, key }) => (
                        <th scope="col" key={key}>
                            {label}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {features.map(({ name, label, ...rest }) => {
                    const restKeys = Object.keys(rest) as UghRest[];
                    return (
                        <tr key={name}>
                            <th scope="row">{label}</th>
                            {restKeys.map((key) => {
                                return (
                                    <td className="no-border" key={key}>
                                        {rest[key]}
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default Features;
