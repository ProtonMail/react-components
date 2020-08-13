import React from 'react';
// import { Icon } from '../../../..';
import { c } from 'ttag';

import { Address } from 'proton-shared/lib/interfaces';
import { getLightOrDark } from 'proton-shared/lib/themes/helpers';

import envelopSvgLight from 'design-system/assets/img/shared/envelop.svg';
import envelopSvgDark from 'design-system/assets/img/shared/envelop-dark.svg';

import { ImportModalModel } from '../../interfaces';

interface Props {
    modalModel: ImportModalModel;
    address: Address;
}

const ImportStartedStep = ({ modalModel, address }: Props) => {
    const envelopSvg = getLightOrDark(envelopSvgLight, envelopSvgDark);

    return (
        <div className="aligncenter">
            <div className="w80 flex flex-spacebetween flex-items-center">
                <img src={envelopSvg} alt="" />

                <img src={envelopSvg} alt="" />
            </div>
            <h3>{c('Info').t`Your import has started!`}</h3>
            <div className="mt1">{c('Info').t`Your messages are being imported from`}</div>
            <div className="mt1">
                <strong>{modalModel.email}</strong>
            </div>
            <div>{c('Info').t`to`}</div>
            <div>
                <strong>{address.Email}</strong>
            </div>
            <div className="mt1">{c('Info').t`We will notify you once your import is finished.`}</div>
            <div>{c('Info').t`Large imports can take several days to complete.`}</div>
            <div className="mt1">{c('Info').t`You can continue using Proton services as usual.`}</div>
        </div>
    );
};

export default ImportStartedStep;
