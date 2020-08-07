import React from 'react';
import { c } from 'ttag';
import brokenImageSvg from 'design-system/assets/img/shared/broken-image.svg';
import { PrimaryButton } from '../../components/button';

interface Props {
    type?: 'file' | 'image';
    onSave?: () => void;
}

const UnsupportedPreview = ({ onSave, type = 'file' }: Props) => {
    // TODO: change based on
    const imageSrc = type === 'file' ? brokenImageSvg : brokenImageSvg;
    const text =
        type === 'file' ? c('Info').t`Preview for this file is unsupported.` : c('Info').t`No preview available.`;

    return (
        <div className="pd-file-preview-container">
            <div className="centered-absolute aligncenter">
                <img className="mb0-5" src={imageSrc} alt={c('Info').t`Unsupported file`} />
                <div className="p0-25">{text}</div>
                {onSave && <PrimaryButton onClick={onSave} className="mt2">{c('Action').t`Download`}</PrimaryButton>}
            </div>
        </div>
    );
};

export default UnsupportedPreview;
