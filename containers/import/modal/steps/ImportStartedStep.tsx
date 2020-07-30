import React from 'react';
import { Icon } from '../../../..';
import { c } from 'ttag';

const ImportStartedStep = () => (
    <div className="mb1 aligncenter">
        <div className="mb1">{c('Info').t`Import in progress...`}</div>
        <Icon name="import" className="fill-pm-blue" size={100} />
    </div>
);

export default ImportStartedStep;
