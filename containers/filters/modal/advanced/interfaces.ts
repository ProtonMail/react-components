import { Annotation } from 'codemirror';

export enum StepSieve {
    NAME,
    SIEVE,
}

export interface ErrorsSieve {
    name: string;
    sieve: string;
}

export interface AdvancedSimpleFilterModalModel {
    id?: string;
    status?: number;
    version?: 1 | 2;
    step: StepSieve;
    name: string;
    sieve: string;
    issues: Annotation[];
}
