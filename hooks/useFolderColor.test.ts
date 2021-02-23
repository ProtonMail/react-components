import { Folder } from 'proton-shared/lib/interfaces/Folder';

import useFolderColor from './useFolderColor';

jest.mock('./useMailSettings', () => ({
    useMailSettings: () => [{ EnableFolderColor: 1, InheritParentFolderColor: 1 }, false],
}));

jest.mock('./useCategories', () => ({
    useFolders: () => [
        [
            { ID: 'A', Color: 'red' },
            { ID: 'B', Color: 'blue', ParentID: 'A' },
            { ID: 'C', Color: 'green', ParentID: 'B' },
        ],
        false,
    ],
}));

describe('useFolderColor hook', () => {
    // it('should not return color if EnableFolderColor is disabled', () => {
    //     const folder = { ID: 'C', Color: 'green' } as Folder;
    //     const color = useFolderColor(folder);
    //     expect(color).toBe(undefined);
    // });

    // it('should return current color if InheritParentFolderColor is disabled', () => {
    //     const folder = { ID: 'C', Color: 'green', ParentID: 'B' } as Folder;
    //     const color = useFolderColor(folder);
    //     expect(color).toBe('green');
    // });

    it('should return current folder color since it is a root', () => {
        const folder = { ID: 'C', Color: 'green' } as Folder;
        const color = useFolderColor(folder);
        expect(color).toBe('green');
    });

    it('should search for root folder color', () => {
        const folder = { ID: 'C', Color: 'green', ParentID: 'B' } as Folder;
        const color = useFolderColor(folder);
        expect(color).toBe('red');
    });
});
