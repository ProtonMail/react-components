export enum Step {
    NAME,
    SIEVE
}

export interface SieveIssue {
    message: string;
    severity: string;
}

export interface FilterModalModel {
    step: Step;
    name: string;
    sieve: string;
    issues: SieveIssue[];
}

export interface Errors {
    name: string;
    sieve: string;
}
