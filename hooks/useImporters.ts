import { ImportersModel, ImportHistoryModel } from 'proton-shared/lib/models/importersModel';
import { ImportMail, ImportMailReport } from '../containers/import/interfaces';
import createUseModelHook from './helpers/createModelHook';

export const useImporters = createUseModelHook<ImportMail[]>(ImportersModel);
export const useImportHistory = createUseModelHook<ImportMailReport[]>(ImportHistoryModel);
