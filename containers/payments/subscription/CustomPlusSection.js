import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { Price, Select, Info } from 'react-components';
import { range } from 'proton-shared/lib/helpers/array';

import { getTextOption, getTotal, getPlan, getAddon } from './helpers';

const spaceOptions = range(5, 21).map((value, index) => ({
    text: getTextOption('space', value, index),
    value: index
}));

const addressOptions = range(5, 51, 5).map((value, index) => ({
    text: getTextOption('address', value, index),
    value: index
}));

const domainOptions = range(1, 11).map((value, index) => ({
    text: getTextOption('domain', value, index),
    value: index
}));

const CustomPlusSection = ({ plans, model, onChange }) => {
    const plusPlan = getPlan(plans, { name: 'plus', cycle: model.cycle });
    const spaceAddon = getAddon(plans, { name: '1gb', cycle: model.cycle });
    const addressAddon = getAddon(plans, { name: '5address', cycle: model.cycle });
    const domainAddon = getAddon(plans, { name: '1domain', cycle: model.cycle });

    const handleChange = (key) => ({ target }) => {
        onChange({ ...model, plansMap: { ...model.plansMap, [key]: +target.value } });
    };

    const total = getTotal({ ...model, plans });

    return (
        <>
            <div className="flex flex-spacebetween mb1 border-bottom">
                <div className="bold">ProtonMail Plus</div>
                <div>
                    <Price currency={model.currency} suffix={c('Suffix').t`/ month`}>
                        {plusPlan.Amount / plusPlan.Cycle}
                    </Price>
                </div>
            </div>
            <div className="flex flex-spacebetween mb1 border-bottom">
                <div>
                    <Select options={spaceOptions} value={model.plansMap['1gb']} onChange={handleChange('1gb')} />
                </div>
                <div>
                    {model.plansMap['1gb'] ? (
                        <Price currency={model.currency} suffix={c('Suffix').t`/ month`}>
                            {spaceAddon.Amount / spaceAddon.Cycle}
                        </Price>
                    ) : (
                        '-'
                    )}
                </div>
            </div>
            <div className="flex flex-spacebetween mb1 border-bottom">
                <div>
                    <Select
                        options={addressOptions}
                        value={model.plansMap['5address']}
                        onChange={handleChange('5address')}
                    />
                    <Info title={c('Tooltip').t`Add additional addresses to your account.`} />
                </div>
                <div>
                    {model.plansMap['5address'] ? (
                        <Price currency={model.currency} suffix={c('Suffix').t`/ month`}>
                            {addressAddon.Amount / addressAddon.Cycle}
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
                    <Info title={c('Tooltip').t`Use your own domain name.`} />
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

CustomPlusSection.propTypes = {
    plans: PropTypes.array.isRequired,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

export default CustomPlusSection;
