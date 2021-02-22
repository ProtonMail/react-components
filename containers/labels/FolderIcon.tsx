import React from 'react';
import { Folder } from 'proton-shared/lib/interfaces/Folder';
import { ROOT_FOLDER } from 'proton-shared/lib/constants';

import { Icon } from '../../components';
import { useMailSettings, useFolders } from '../../hooks';

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
    const [folders] = useFolders();
    const isRoot = folder.ParentID === ROOT_FOLDER;

    const getColor = ({ ParentID, Color }: Folder): string => {
        if (!mailSettings?.InheritParentFolderColor) {
            return Color;
        }
        if (ParentID === ROOT_FOLDER) {
            return Color;
        }
        const folder = folders?.find(({ ID }) => ID === ParentID);
        if (folder) {
            return getColor(folder);
        }
        return '';
    };

    const color = mailSettings?.EnableFolderColor ? getColor(folder) : undefined;

    return <Icon name={getIconName(isRoot, color)} color={color} className={className} alt={folder.Name} />;
};

export default FolderIcon;
