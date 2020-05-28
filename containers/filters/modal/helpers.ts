import { normalize } from 'proton-shared/lib/helpers/string';

import { ModalModel, Filter } from './interfaces';

export const hasValidName = (model: ModalModel, filters: Filter[]): boolean =>
    !!model.name && !filters.find(({ Name }) => normalize(Name) === normalize(model.name));

export const hasValidActions = (model: ModalModel): boolean => !!model.actions.length;

export const hasValidConditions = (model: ModalModel): boolean => !!model.conditions.length;
