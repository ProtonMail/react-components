import React from 'react';
import PropTypes from 'prop-types';
import { Price, Select } from 'react-components';
import { c } from 'ttag';
import { range } from 'proton-shared/lib/helpers/array';

import { getTextOption, getPlan, getAddon, getTotal } from './helpers';

const memberOptions = range(1, 5001).map((value, index) => ({
    text: getTextOption('member', value, index),
    value: index
}));

const domainOptions = range(2, 101).map((value, index) => ({
    text: getTextOption('domain', value, index),
    value: index
}));

const CustomProfessionalSection = ({ plans, model, onChange }) => {
    const professionalPlan = getPlan(plans, { name: 'professional', cycle: model.cycle });
    const memberAddon = getAddon(plans, { name: '1member', cycle: model.cycle });
    const domainAddon = getAddon(plans, { name: '1domain', cycle: model.cycle });

    const handleChange = (key) => ({ target }) => {
        onChange({ ...model, plansMap: { ...model.plansMap, [key]: +target.value } });
    };

    const total = getTotal({ ...model, plans });

    return (
        <>
            <div className="flex flex-spacebetween mb1 border-bottom">
                <div className="bold">ProtonMail Professional</div>
                <div>
                    <Price currency={model.currency} suffix={c('Suffix').t`/ month`}>
                        {professionalPlan.Amount / professionalPlan.Cycle}
                    </Price>
                </div>
            </div>
            <div className="flex flex-spacebetween mb1 border-bottom">
                <div>
                    <Select
                        options={memberOptions}
                        value={model.plansMap['1member']}
                        onChange={handleChange('1member')}
                    />
                </div>
                <div>
                    {model.plansMap['1member'] ? (
                        <Price currency={model.currency} suffix={c('Suffix').t`/ month`}>
                            {memberAddon.Amount / memberAddon.Cycle}
                        </Price>
                    ) : (
                        '-'
                    )}
                </div>
            </div>
            <div className="flex flex-spacebetween mb1 border-bottom">
                <div>
                    <Select
                        options={domainOptions}
                        value={model.plansMap['1domain']}
                        onChange={handleChange('1domain')}
                    />
                </div>
                <div>
                    {model.plansMap['1domain'] ? (
                        <Price currency={model.currency} suffix={c('Suffix').t`/ month`}>
                            {domainAddon.Amount / domainAddon.Cycle}
                        </Price>
                    ) : (
                        '-'
                    )}
                </div>
            </div>
            <div className="flex flex-spacebetween mb1">
                <div className="bold">{c('Label').t`Total`}</div>
                <div>
                    <Price currency={model.currency} suffix={c('Suffix').t`/ month`}>
                        {total / model.cycle}
                    </Price>
                </div>
            </div>
        </>
    );
};

CustomProfessionalSection.propTypes = {
    plans: PropTypes.array.isRequired,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

export default CustomProfessionalSection;
