import React from 'react';
import { Folder } from 'proton-shared/lib/interfaces/Folder';
import { ROOT_FOLDER } from 'proton-shared/lib/constants';

import { Icon } from '../../components';
import { useMailSettings } from '../../hooks';

interface Props {
    folder: Folder;
    className?: string;
}

const getIconName = (isRoot?: boolean, color?: string) => {
    if (isRoot) {
        return color ? 'parent-folder-filled' : 'parent-folder';
    }
    return color ? 'folder-filled' : 'folder';
};

const FolderIcon = ({ folder, className }: Props) => {
    const [mailSettings] = useMailSettings();
    const isRoot = folder.ParentID === ROOT_FOLDER;
    const folderColor = isRoot ? folder.Color : undefined;
    const color = mailSettings?.EnableFolderColor ? folderColor : undefined;

    return <Icon name={getIconName(isRoot, color)} color={color} className={className} alt={folder.Name} />;
};

export default FolderIcon;
