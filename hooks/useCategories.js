import { LabelsModel } from 'proton-shared/lib/models/labelsModel';
import { LABEL_TYPE } from 'proton-shared/lib/constants';

import createUseModelHook from './helpers/createModelHook';

const useCategories = createUseModelHook(LabelsModel);

const filterCategories = (categories, type) => {
    if (!Array.isArray(categories)) {
        return;
    }
    return categories.filter(({ Type }) => Type === type);
};

export const useLabels = () => {
    const [categories, loading] = useCategories();
    const labels = filterCategories(categories, LABEL_TYPE.MESSAGE_LABEL);
    return [labels, loading];
};

export const useFolders = () => {
    const [categories, loading] = useCategories();
    const folders = filterCategories(categories, LABEL_TYPE.MESSAGE_FOLDER);
    return [folders, loading];
};

export const useContactGroups = () => {
    const [categories, loading] = useCategories();
    const contactGroups = filterCategories(categories, LABEL_TYPE.CONTACT_GROUP);
    return [contactGroups, loading];
};
