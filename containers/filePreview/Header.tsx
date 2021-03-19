import React from 'react';
import { c } from 'ttag';
import { Icon, FileIcon, FileNameDisplay } from '../../components';

interface Props {
    name?: string;
    mimeType?: string;
    onClose?: () => void;
    onSave?: () => void;
    children?: React.ReactNode;
}

const Header = ({ mimeType, name, onClose, onSave, children }: Props) => {
    return (
        <div className="flex flex-justify-space-between flex-align-items-center p2 relative">
            <div className="file-preview-filename flex flex-align-items-center flex-nowrap">
                {mimeType && <FileIcon mimeType={mimeType} />}
                <FileNameDisplay text={name} />
            </div>
            {children}
            <div className="flex flex-align-items-center">
                {onSave && (
                    <button type="button" title={c('Action').t`Download`} onClick={onSave} className="ml1-5">
                        <Icon name="download" size={20} alt={c('Action').t`Download`} />
                    </button>
                )}
                {onClose && (
                    <button type="button" title={c('Action').t`Close`} onClick={onClose} className="ml1-5">
                        <Icon name="off" size={20} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Header;
