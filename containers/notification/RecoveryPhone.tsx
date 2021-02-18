import React from 'react';
import { c } from 'ttag';

import { PrimaryButton } from '../../components';

interface Props {
    phone: string | null;
    onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const RecoveryPhone = ({ phone, onClick }: Props) => {
    return (
        <div className="flex flex-align-items-center">
            <div className="text-ellipsis flex-item-fluid" title={phone || ''}>
                {phone || c('Info').t`Not set`}
            </div>
            <div className="ml1 on-mobile-ml0">
                <PrimaryButton onClick={onClick}>{c('Action').t`Edit`}</PrimaryButton>
            </div>
        </div>
    );
};

export default RecoveryPhone;
