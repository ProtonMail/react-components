import React from 'react';
import PropTypes from 'prop-types';

import CyclePromotion from './CyclePromotion';
import CustomPlusSection from './CustomPlusSection';
import CustomProfessionalSection from './CustomProfessionalSection';

const CustomMailSection = ({ plans, model, onChange }) => {
    return (
        <>
            <CyclePromotion model={model} onChange={onChange} />
            {model.plansMap.plus ? <CustomPlusSection plans={plans} model={model} onChange={onChange} /> : null}
            {model.plansMap.professional ? (
                <CustomProfessionalSection plans={plans} model={model} onChange={onChange} />
            ) : null}
        </>
    );
};

CustomMailSection.propTypes = {
    plans: PropTypes.array.isRequired,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

export default CustomMailSection;
