import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'react-components';
import { range } from 'proton-shared/lib/helpers/array';

import PlanPrice from './PlanPrice';
import { getTextOption, getPlan, getAddon } from './helpers';

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

    return (
        <>
            <div className="flex flex-spacebetween mb1 border-bottom">
                <div className="bold">ProtonMail Professional</div>
                <div>
                    <PlanPrice
                        quantity={model.plansMap.professional}
                        currency={model.currency}
                        amount={professionalPlan.Amount}
                        cycle={professionalPlan.Cycle}
                    />
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
                        <PlanPrice
                            quantity={model.plansMap['1member']}
                            currency={model.currency}
                            amount={memberAddon.Amount}
                            cycle={memberAddon.Cycle}
                        />
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
                        <PlanPrice
                            quantity={model.plansMap['1domain']}
                            currency={model.currency}
                            amount={domainAddon.Amount}
                            cycle={domainAddon.Cycle}
                        />
                    ) : (
                        '-'
                    )}
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
