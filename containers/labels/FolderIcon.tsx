import React from 'react';

import { Icon } from '../../components';
import { useMailSettings } from '../../hooks';

interface Props {
    isRoot?: boolean;
    color?: string;
    className?: string;
}

const getIconName = (isRoot?: boolean, color?: string) => {
    if (isRoot) {
        return color ? 'parent-folder-filled' : 'parent-folder';
    }
    return color ? 'folder-filled' : 'folder';
};

const FolderIcon = ({ isRoot, color: folderColor, className }: Props) => {
    const [mailSettings] = useMailSettings();
    const color =
        mailSettings?.EnableFolderColor && !(mailSettings?.InheritParentFolderColor && isRoot)
            ? folderColor
            : undefined;

    return <Icon name={getIconName(isRoot, color)} color={color} className={className} />;
};

export default FolderIcon;
