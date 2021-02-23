import { ROOT_FOLDER } from 'proton-shared/lib/constants';
import { Folder } from 'proton-shared/lib/interfaces/Folder';

import { useFolders } from './useCategories';
import { useMailSettings } from './useMailSettings';

const useFolderColor = (folder: Folder) => {
    const [folders] = useFolders();
    const [mailSettings] = useMailSettings();

    if (!mailSettings?.EnableFolderColor) {
        return undefined;
    }
    if (!mailSettings?.InheritParentFolderColor) {
        return folder.Color;
    }

    const getParentFolderColor = ({ ParentID, Color }: Folder): string | undefined => {
        if (ParentID === ROOT_FOLDER) {
            return Color;
        }
        const folder = folders?.find(({ ID }) => ID === ParentID);
        if (folder) {
            return getParentFolderColor(folder);
        }
        return undefined;
    };

    return getParentFolderColor(folder);
};

export default useFolderColor;
