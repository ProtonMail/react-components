import { ImportersModel, ImportHistoryModel } from 'proton-shared/lib/models/importersModel';
import { Importer, ImportHistory } from '../containers/import/interfaces';
import createUseModelHook from './helpers/createModelHook';

export const useImporters = createUseModelHook<Importer[]>(ImportersModel);
export const useImportHistory = createUseModelHook<ImportHistory[]>(ImportHistoryModel);
