export enum Step {
    NAME,
    CONDITIONS,
    ACTIONS,
    PREVIEW
}

export interface Action {
    type: string;
}

export interface Condition {
    type: string;
}

export interface ModalModel {
    step: Step;
    name: string;
    actions: Action[];
    conditions: Condition[];
}

export interface Filter {
    ID: string;
    Name: string;
    Status: number;
    Priority: number;
    Sieve: string;
    Version: number;
}

export interface Errors {
    name: string;
    actions: string;
    conditions: string;
}
