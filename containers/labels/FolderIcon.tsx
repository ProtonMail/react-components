import React from 'react';
import { Folder } from 'proton-shared/lib/interfaces/Folder';
import { ROOT_FOLDER } from 'proton-shared/lib/constants';

import { Icon } from '../../components';
import { useFolderColor } from '../../hooks';

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
    const isRoot = folder.ParentID === ROOT_FOLDER;
    const color = useFolderColor(folder);

    return <Icon name={getIconName(isRoot, color)} color={color} className={className} alt={folder.Name} />;
};

export default FolderIcon;
